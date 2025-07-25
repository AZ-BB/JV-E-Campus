"use server"
import { db } from "@/db"
import { UserRole } from "@/db/enums"
import { branches, staff, staffRoles, users } from "@/db/schema/schema"
import { createSupabaseAdminClient } from "@/utils/supabase-browser"
import { createSupabaseServerClient } from "@/utils/supabase-server"
import { GeneralActionResponse } from "@/types/general-action-response"
import { aliasedTable, and, asc, count, desc, eq, ilike, inArray, or, SQL, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import Staff from "@/app/staff/page"
import responses from "@/responses/responses"


// Export the type based on the query selection
export type Staff = (typeof users.$inferSelect) & (typeof staff.$inferSelect) & {
  branchName: string
  createdByName: string
  staffRoleName: string
  staffRoleFullName: string
}

export const getStaffUsers = async ({
  page = 1,
  limit = 20,
  search = "",
  orderBy = "createdAt",
  orderDirection = "desc",
  filters = {
    staffRoleIds: [],
    branchIds: [],
    createdByIds: [],
    nationality: []
  }
}: {
  page: number,
  limit: number,
  search: string,
  orderBy: keyof Staff,
  orderDirection: "asc" | "desc",
  filters: {
    staffRoleIds: number[],
    branchIds: number[],
    createdByIds: number[],
    nationality: string[]
  }
}): Promise<GeneralActionResponse<{ rows: Staff[], count: number, numberOfPages: number }>> => {
  try {
    const usersCreator = aliasedTable(users, "usersCreator");

    const tx = await db.transaction(async (tx) => {
      const rowsCount = await tx.select({
        count: count(users.id),
      }).from(users).where(eq(users.role, UserRole.STAFF))

      const staffQuerySelection = {
        // Users table fields
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
        language: users.language,
        profilePictureUrl: users.profilePictureUrl,
        createdBy: users.createdBy,
        createdAt: users.createdAt,
        authUserId: users.authUserId,

        // Staff table fields
        staffId: staff.id,
        userId: staff.userId,
        nationality: staff.nationality,
        phoneNumber: staff.phoneNumber,
        staffCategory: staff.staffCategory,
        staffProfilePictureUrl: staff.profilePictureUrl,
        firstLogin: staff.firstLogin,
        branchId: staff.branchId,
        staffRoleId: staff.staffRoleId,

        // Branches table fields
        branchName: branches.name,

        // StaffRoles table fields
        staffRoleName: staffRoles.name,
        createdByName: usersCreator.fullName,
      } as const

      let query = db
        .select(staffQuerySelection)
        .from(users)
        .innerJoin(staff, eq(users.id, staff.userId))
        .innerJoin(branches, eq(staff.branchId, branches.id))
        .leftJoin(usersCreator, eq(users.createdBy, usersCreator.id))
        .leftJoin(staffRoles, eq(staff.staffRoleId, staffRoles.id))

      const conditions: any = [
        eq(users.role, UserRole.STAFF),
      ]

      if (search) {
        conditions.push(or(ilike(users.fullName, `%${search}%`), ilike(users.email, `%${search}%`)))
      }

      if (filters.staffRoleIds.length > 0) {
        conditions.push(inArray(staff.staffRoleId, filters.staffRoleIds))
      }
      if (filters.branchIds.length > 0) {
        conditions.push(inArray(staff.branchId, filters.branchIds))
      }
      if (filters.createdByIds.length > 0) {
        conditions.push(inArray(users.createdBy, filters.createdByIds))
      }
      if (filters.nationality.length > 0) {
        conditions.push(inArray(staff.nationality, filters.nationality))
      }

      query.where(and(...conditions))

      const orderByColumn = staffQuerySelection[orderBy as keyof typeof staffQuerySelection] || users.createdAt
      const rows = await query.limit(limit).offset((page - 1) * limit).orderBy(orderDirection === "asc" ? asc(orderByColumn) : desc(orderByColumn))

      return { rows, count: rowsCount[0].count, numberOfPages: Math.ceil(rowsCount[0].count / limit) }
    })

    return {
      data: {
        rows: tx.rows,
        count: tx.count,
        numberOfPages: tx.numberOfPages
      }, error: null
    }
  } catch (error) {
    console.error(error)
    return { data: { rows: [], count: 0, numberOfPages: 0 }, error: responses.staff.fetchedAll.error.general }
  }
}

export const getStaffUserById = async (userId: number): Promise<GeneralActionResponse<Staff | null>> => {
  try {
    const usersCreator = aliasedTable(users, "usersCreator");

    const result = await db
      .select({
        // Users table fields
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
        language: users.language,
        profilePictureUrl: users.profilePictureUrl,
        createdBy: users.createdBy,
        createdAt: users.createdAt,
        authUserId: users.authUserId,

        // Staff table fields
        staffId: staff.id,
        userId: staff.userId,
        nationality: staff.nationality,
        phoneNumber: staff.phoneNumber,
        staffCategory: staff.staffCategory,
        staffProfilePictureUrl: staff.profilePictureUrl,
        branchId: staff.branchId,
        staffRoleId: staff.staffRoleId,

        // Branches table fields
        branchName: branches.name,

        // UsersCreator table fields  
        createdByName: usersCreator.fullName,

        // StaffRoles table fields
        staffRoleName: staffRoles.name,
        staffRoleFullName: staffRoles.fullName,
      })
      .from(users)
      .innerJoin(staff, eq(users.id, staff.userId))
      .innerJoin(branches, eq(staff.branchId, branches.id))
      .leftJoin(usersCreator, eq(users.createdBy, usersCreator.id))
      .leftJoin(staffRoles, eq(staff.staffRoleId, staffRoles.id))
      .where(and(eq(users.role, UserRole.STAFF), eq(users.id, userId)))
      .limit(1)

    return { data: result[0] || null, error: null }
  } catch (error) {
    console.error(error)
    return { data: null, error: responses.staff.fetchedAll.error.general }
  }
}

export const getAdminUsers = async (
  page: number = 1,
  limit: number = 20
): Promise<GeneralActionResponse<(typeof users.$inferSelect)[]>> => {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.role, UserRole.ADMIN))
      .limit(limit)
      .offset((page - 1) * limit)
    return { data: result, error: null }
  } catch (error) {
    console.error(error)
    return { data: [], error: responses.staff.fetchedAll.error.general }
  }
}

export const getAdminsNames = async (search: string = ""): Promise<GeneralActionResponse<{ id: number, fullName: string }[]>> => {
  try {
    const conditions: any = [
      eq(users.role, UserRole.ADMIN),
    ]
    if (search) {
      conditions.push(ilike(users.fullName, `%${search}%`))
    }
    const result = await db.select({ id: users.id, fullName: users.fullName }).from(users).where(and(...conditions)).orderBy(asc(users.fullName)).limit(10)
    return { data: result, error: null }
  } catch (error) {
    console.error(error)
    return { data: [], error: error as string }
  }
}

export type StaffStats = {
  staff_count: number
}

export const getStaffStats = async (): Promise<GeneralActionResponse<StaffStats>> => {
  try {
    const result = await db.execute<{
      count: number
    }>(sql`
      SELECT
        COUNT(*)
        FROM staff
    `)

    return { data: { staff_count: result.rows[0].count }, error: null }
  } catch (error) {
    console.error(error)
    return { data: { staff_count: 0 }, error: responses.staff.fetchedAll.error.general }
  }
}

// CREATORS
export interface CreateAdminUser {
  email: string
  password: string
  fullName: string
}

export const createAdminUser = async (
  user: CreateAdminUser
): Promise<GeneralActionResponse<typeof users.$inferSelect | null>> => {
  let authUserId: string | null = null
  let dbUserId: number | null = null

  try {
    if (!user.email.trim() || !user.password.trim() || !user.fullName.trim()) {
      return { data: null, error: responses.staff.created.error.missingFields }
    }

    const supabaseAdmin = createSupabaseAdminClient()

    // Step 1: Create Auth User
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          role: UserRole.ADMIN,
          full_name: user.fullName,
        },
      })

    if (authError) {
      console.error("Failed to create auth user:", authError)
      return { data: null, error: authError.message }
    }

    authUserId = authData.user.id

    // Step 2: Create Database User
    const supabase = await createSupabaseServerClient()
    const { data: currentUser } =
      await supabase.auth.getUser()

    let dbResult
    try {
      dbResult = await db
        .insert(users)
        .values({
          email: user.email,
          role: UserRole.ADMIN,
          fullName: user.fullName,
          authUserId: authData.user.id,
          createdBy: currentUser?.user?.user_metadata?.db_user_id || 1,
          language: "en",
          profilePictureUrl: "",
        })
        .returning()

      dbUserId = dbResult[0].id
    } catch (dbError) {
      console.error(
        "Failed to create database user, rolling back auth user:",
        dbError
      )

      // Rollback: Delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authUserId)

      return { data: null, error: responses.staff.created.error.general }
    }

    // Step 3: Update Auth User Metadata
    try {
      await supabaseAdmin.auth.admin.updateUserById(authData.user.id, {
        user_metadata: {
          ...authData?.user?.user_metadata,
          db_user_id: dbResult[0].id,
        },
      })
    } catch (metadataError) {
      console.error(
        "Failed to update user metadata, rolling back both auth and database user:",
        metadataError
      )

      // Rollback: Delete both database user and auth user
      try {
        await db.delete(users).where(eq(users.id, dbUserId!))
      } catch (dbDeleteError) {
        console.error("Failed to rollback database user:", dbDeleteError)
      }

      try {
        await supabaseAdmin.auth.admin.deleteUser(authUserId)
      } catch (authDeleteError) {
        console.error("Failed to rollback auth user:", authDeleteError)
      }

      return {
        data: null,
        error: responses.staff.created.error.general,
      }
    }

    revalidatePath("/admin")
    return { data: null, error: null, message: responses.staff.created.success }
  } catch (error) {
    console.error("Unexpected error in createAdminUser:", error)

    // General rollback for unexpected errors
    if (dbUserId) {
      try {
        await db.delete(users).where(eq(users.id, dbUserId))
      } catch (dbDeleteError) {
        console.error(
          "Failed to rollback database user in general catch:",
          dbDeleteError
        )
      }
    }

    if (authUserId) {
      try {
        await createSupabaseAdminClient().auth.admin.deleteUser(authUserId)
      } catch (authDeleteError) {
        console.error(
          "Failed to rollback auth user in general catch:",
          authDeleteError
        )
      }
    }

    return { data: null, error: error as string } // Keep the supabase error message
  }
}

export interface CreateStaffUser {
  email: string
  password: string
  fullName: string
  branchId: number
  staffRoleId: number
  phoneNumber?: string
  nationality?: string
  profilePictureUrl?: string
}

export const createStaffUser = async (
  newUser: CreateStaffUser
): Promise<
  GeneralActionResponse<
    (typeof users.$inferSelect & typeof staff.$inferSelect) | null
  >
> => {
  try {
    if (
      !newUser.email.trim() ||
      !newUser.password.trim() ||
      !newUser.fullName.trim() ||
      !newUser.branchId ||
      !newUser.staffRoleId
    ) {
      return {
        data: null,
        error:
          responses.staff.created.error.missingFields,
      }
    }
    const supabaseAdmin = createSupabaseAdminClient()
    const supabase = await createSupabaseServerClient()
    const { data: currentUser, error: currentUserError } =
      await supabase.auth.getUser()

    if (currentUserError) {
      return { data: null, error: responses.staff.created.error.general }
    }

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true,
        user_metadata: {
          role: UserRole.STAFF,
          full_name: newUser.fullName,
        },
      })

    if (authError) {
      console.error("Failed to create auth user:", authError)
      return { data: null, error: authError.message }
    }

    let userResult
    try {
      userResult = await db
        .insert(users)
        .values({
          email: newUser.email,
          role: UserRole.STAFF,
          fullName: newUser.fullName,
          createdBy: currentUser?.user?.user_metadata?.db_user_id,
          language: "en",
          authUserId: authData.user.id,
          profilePictureUrl: newUser.profilePictureUrl || "",
        })
        .returning()
    } catch (error) {
      console.error("Failed to create user rolling back auth user:", error)
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return { data: null, error: error as string } // Keep the supabase error message
    }

    try {
      const staffResult = await db
        .insert(staff)
        .values({
          userId: userResult[0].id,
          branchId: newUser.branchId,
          staffCategory: "MANAGER", // Deprecated
          staffRoleId: newUser.staffRoleId,
          phoneNumber: newUser.phoneNumber,
          nationality: newUser.nationality,
          firstLogin: true,
          profilePictureUrl: newUser.profilePictureUrl,
        })
        .returning()

      revalidatePath("/admin")
      return { data: { ...userResult[0], ...staffResult[0] }, error: null, message: responses.staff.created.success }
    } catch (error) {
      console.error(
        "Failed to create staff user, rolling back user creation:",
        error
      )
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        await db.delete(users).where(eq(users.id, userResult[0].id))
      } catch (rollbackError) {
        console.error("Failed to rollback user creation:", rollbackError)
      }
      return {
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }
    }
  } catch (error) {
    console.error("Unexpected error in createStaffUser:", error)
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

// UPDATERS

export const updateStaffUser = async (userId: number, data: Partial<CreateStaffUser>): Promise<GeneralActionResponse<void>> => {
  try {
    if (data.fullName) {
      await db.update(users).set({ fullName: data.fullName, profilePictureUrl: data.profilePictureUrl }).where(eq(users.id, userId))
    } else {
      await db.update(users).set({ profilePictureUrl: data.profilePictureUrl }).where(eq(users.id, userId))
    }

    await db.update(staff).set(data).where(eq(staff.userId, userId))
    revalidatePath("/admin/staff")
    return { data: null, error: null, message: responses.staff.updated.success }
  } catch (error) {
    console.error("Unexpected error in updateStaffUser:", error)
    return { data: null, error: responses.staff.updated.error.general }
  }
}

// DELETERS
export const deleteStaffUser = async (userId: number): Promise<GeneralActionResponse<void>> => {
  try {
    const result = await db.select({
      authUserId: users.authUserId,
    }).from(users).where(eq(users.id, userId))
    if (!result[0]) {
      console.error("User not found")
      return { data: null, error: responses.staff.deleted.error.notFound }
    } else {
      const supabaseAdmin = createSupabaseAdminClient()
      console.log("Deleting user with auth user id:", result[0])
      await supabaseAdmin.auth.admin.deleteUser(result[0].authUserId!)
    }
    revalidatePath("/admin/staff")
    return { data: null, error: null, message: responses.staff.deleted.success }
  } catch (error) {
    console.error(error)
    return { data: null, error: responses.staff.deleted.error.general }
  }
}
"use server"
import { db } from "@/db"
import { UserRole } from "@/db/enums"
import { branches, staff, staffRoles, users } from "@/db/schema/schema"
import { createSupabaseAdminClient } from "@/utils/supabase-browser"
import { createSupabaseServerClient } from "@/utils/supabase-server"
import { GeneralActionResponse } from "@/types/general-action-response"
import { aliasedTable, and, asc, count, desc, eq, ilike, inArray, or, SQL, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import responses from "@/responses/responses"
import { getCurrentUser } from "@/utils/utils"
import { createLog } from "./logs"


// Export the type based on the query selection
export type Admin = (typeof users.$inferSelect) & {
  createdByFullName: string
  created_users_count: number
}

export const getAdmins = async ({
  page = 1,
  limit = 10,
  search = "",
  orderBy = "createdAt",
  orderDirection = "desc"
}: {
  page: number,
  limit: number,
  search: string,
  orderBy: keyof Admin,
  orderDirection: "asc" | "desc"
}): Promise<GeneralActionResponse<{ rows: Admin[], count: number, numberOfPages: number }>> => {
  try {
    const usersCreator = aliasedTable(users, "usersCreator");
    const usersCreatorFullName = aliasedTable(users, "usersCreatorFullName");

    const tx = await db.transaction(async (tx) => {
      const rowsCount = await tx.select({
        count: count(users.id),
      }).from(users).where(eq(users.role, UserRole.ADMIN))

      const usersQuerySelection = {
        // Users table fields
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
        profilePictureUrl: users.profilePictureUrl,
        createdBy: users.createdBy,
        createdAt: users.createdAt,
        authUserId: users.authUserId,

        createdByFullName: usersCreatorFullName.fullName,

        created_users_count: count(users.id),
      } as const

      let query = db
        .select(usersQuerySelection)
        .from(users)
        .leftJoin(usersCreator, eq(users.id, usersCreator.createdBy))
        .leftJoin(usersCreatorFullName, eq(users.createdBy, usersCreatorFullName.id))
        .groupBy(users.id, usersCreatorFullName.fullName)


      const conditions: any = [
        eq(users.role, UserRole.ADMIN),
      ]

      if (search) {
        conditions.push(or(ilike(users.fullName, `%${search}%`), ilike(users.email, `%${search}%`)))
      }


      query.where(and(...conditions))

      const orderByColumn = usersQuerySelection[orderBy as keyof typeof usersQuerySelection] || users.createdAt
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



export type UsersStats = {
  users_count: number
}

export const getUsersStats = async (): Promise<GeneralActionResponse<UsersStats>> => {
  try {
    const result = await db.execute<{
      count: number
    }>(sql`
      SELECT
        COUNT(*)
        FROM users
    `)

    return { data: { users_count: result.rows[0].count }, error: null }
  } catch (error) {
    console.error(error)
    return { data: { users_count: 0 }, error: responses.staff.fetchedAll.error.general }
  }
}


export const getAdminUserById = async (userId: number): Promise<GeneralActionResponse<Admin | null>> => {
  try {
    const usersCreator = aliasedTable(users, "usersCreator");
    const usersCreatorFullName = aliasedTable(users, "usersCreatorFullName");

    const usersQuerySelection = {
      // Users table fields
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
      profilePictureUrl: users.profilePictureUrl,
      createdBy: users.createdBy,
      createdAt: users.createdAt,
      authUserId: users.authUserId,

      createdByFullName: usersCreatorFullName.fullName,

      created_users_count: count(users.id),
    } as const

    let query = db
      .select(usersQuerySelection)
      .from(users)
      .leftJoin(usersCreator, eq(users.id, usersCreator.createdBy))
      .leftJoin(usersCreatorFullName, eq(users.createdBy, usersCreatorFullName.id))
      .groupBy(users.id, usersCreatorFullName.fullName)
      .where(eq(users.id, userId))

    const result = await query.limit(1)

    if (result.length === 0) {
      return { data: null, error: responses.admin.notFound.error }
    }

    return { data: result[0] || null, error: null }
  } catch (error) {
    console.error(error)
    return { data: null, error: responses.staff.fetchedAll.error.general }
  }
}



// CREATORS
export interface CreateAdminUser {
  email: string
  password: string
  fullName: string
  profilePictureUrl?: string
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
    const currentUser = await getCurrentUser()

    let dbResult
    try {
      dbResult = await db
        .insert(users)
        .values({
          email: user.email,
          role: UserRole.ADMIN,
          fullName: user.fullName,
          authUserId: authData.user.id,
          createdBy: currentUser?.user?.user_metadata?.db_user_id || 3,
          language: "en",
          profilePictureUrl: user.profilePictureUrl || "",
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

    createLog({
      type: "CREATE_ADMIN_USER",
      actorId: currentUser?.user?.user_metadata?.db_user_id || 3,
      actedOnId: dbUserId,
      actedOnType: "ADMIN_USER",
      message: "Admin user created with email: " + user.email,
      metadata: {
        fullName: user.fullName
      }
    })

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


// UPDATERS

export const updateAdminUser = async (userId: number, data: Partial<CreateAdminUser>): Promise<GeneralActionResponse<void>> => {
  try {

    let result

    if (data.fullName) {
      result = await db.update(users).set({ fullName: data.fullName, profilePictureUrl: data.profilePictureUrl }).where(eq(users.id, userId)).returning({
        email: users.email
      })
    } else {
      result = await db.update(users).set({ profilePictureUrl: data.profilePictureUrl }).where(eq(users.id, userId)).returning({
        email: users.email
      })
    }

    const currentUser = await getCurrentUser()

    createLog({
      type: "UPDATE_ADMIN_USER",
      actorId: currentUser?.user?.user_metadata?.db_user_id || 1,
      actedOnId: userId,
      actedOnType: "ADMIN_USER",
      message: "Admin user updated with email: " + result[0].email,
      metadata: {
        fullName: data.fullName
      }
    })
    revalidatePath("/admin/users")
    return { data: null, error: null, message: responses.admin.updated.success }
  } catch (error) {
    console.error("Unexpected error in updateAdminUser:", error)
    return { data: null, error: responses.admin.updated.error.general }
  }
}

// DELETERS
export const deleteAdminUser = async (userId: number): Promise<GeneralActionResponse<void>> => {
  try {
    const result = await db.select({
      authUserId: users.authUserId,
      email: users.email,
    }).from(users).where(eq(users.id, userId))
    if (!result[0]) {
      console.error("User not found")
      return { data: null, error: responses.admin.notFound.error }
    } else {
      const supabaseAdmin = createSupabaseAdminClient()
      console.log("Deleting user with auth user id:", result[0])
      await supabaseAdmin.auth.admin.deleteUser(result[0].authUserId!)
    }

    const currentUser = await getCurrentUser()

    createLog({
      type: "DELETE_ADMIN_USER",
      actorId: currentUser?.user?.user_metadata?.db_user_id || 1,
      actedOnId: userId,
      actedOnType: "ADMIN_USER",
      message: "Admin user deleted with email: " + result[0].email,
      metadata: {
        email: result[0].email
      }
    })

    revalidatePath("/admin/users")
    return { data: null, error: null, message: responses.admin.deleted.success }
  } catch (error) {
    console.error(error)
    return { data: null, error: responses.admin.deleted.error.general }
  }
}
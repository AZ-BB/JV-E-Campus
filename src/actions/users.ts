"use server"
import { db } from "@/db"
import { StaffCategory, UserRole } from "@/db/enums"
import { branches, staff, users } from "@/db/schema/schema"
import { createSupabaseAdminClient } from "@/utils/supabase-browser"
import { createSupabaseServerClient } from "@/utils/supabase-server"
import { GeneralActionResponse } from "@/types/general-action-response"
import { aliasedTable, count, eq, sql } from "drizzle-orm"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"



// GETTERS
export type Staff = (typeof users.$inferSelect) & (typeof staff.$inferSelect) & {
  branchName: string
  createdByName: string
}
export const getStaffUsers = async (
  page: number = 1,
  limit: number = 20
): Promise<GeneralActionResponse<Staff[]>> => {
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
        firstLogin: staff.firstLogin,
        branchId: staff.branchId,
        branchName: branches.name,
        createdByName: usersCreator.fullName,
      })
      .from(users)
      .innerJoin(staff, eq(users.id, staff.userId))
      .innerJoin(branches, eq(staff.branchId, branches.id))
      .leftJoin(usersCreator, eq(users.id, usersCreator.id))
      .where(eq(users.role, UserRole.STAFF))
      .limit(limit)
      .offset((page - 1) * limit)
    
    return { data: result, error: null }
  } catch (error) {
    console.error(error)
    return { data: [], error: error as string }
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
    return { data: [], error: error as string }
  }
}

export type StaffStats = {
  total_staff: number
  total_foh: number
  total_boh: number
  total_manager: number
}

export const getStaffStats = async (): Promise<GeneralActionResponse<StaffStats>> => {
  try {
    const result = await db.execute<StaffStats>(sql`
      SELECT
        COUNT(*) AS total_staff,
        COUNT(CASE WHEN staff_category = 'FOH' THEN 1 END) AS total_foh,
        COUNT(CASE WHEN staff_category = 'BOH' THEN 1 END) AS total_boh,
        COUNT(CASE WHEN staff_category = 'MANAGER' THEN 1 END) AS total_manager
        FROM staff
    `)
    return { data: result.rows[0], error: null }
  } catch (error) {
    console.error(error)
    return { data: { total_staff: 0, total_foh: 0, total_boh: 0, total_manager: 0 }, error: error as string }
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
      return { data: null, error: "Email, password and full name are required" }
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
    const { data: currentUser, error: currentUserError } =
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

      return { data: null, error: `Failed to create database user: ${dbError}` }
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
        error: `Failed to update user metadata: ${metadataError}`,
      }
    }

    revalidatePath("/admin")
    return { data: null, error: null }
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

    return { data: null, error: error as string }
  }
}

export interface CreateStaffUser {
  email: string
  password: string
  fullName: string
  branchId: number
  staffCategory: StaffCategory
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
      !newUser.staffCategory
    ) {
      return {
        data: null,
        error:
          "Email, password, full name, branch id and staff category are required",
      }
    }
    const supabaseAdmin = createSupabaseAdminClient()
    const supabase = await createSupabaseServerClient()
    const { data: currentUser, error: currentUserError } =
      await supabase.auth.getUser()

    if (currentUserError) {
      return { data: null, error: currentUserError.message }
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
      })
      .returning()
    } catch (error) {
      console.error("Failed to create user rolling back auth user:", error)
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return { data: null, error: error as string }
    }

    try {
      const staffResult = await db
        .insert(staff)
        .values({
          userId: userResult[0].id,
          branchId: newUser.branchId,
          staffCategory: newUser.staffCategory,
          phoneNumber: newUser.phoneNumber,
          nationality: newUser.nationality,
          firstLogin: true,
          profilePictureUrl: newUser.profilePictureUrl,
        })
        .returning()

      revalidatePath("/admin")
      return { data: { ...userResult[0], ...staffResult[0] }, error: null }
    } catch (error) {
      console.error(
        "Failed to create staff user, rolling back user creation:",
        error
      )
      try {
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

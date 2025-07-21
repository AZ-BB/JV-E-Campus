"use server"
import { db } from "@/db"
import { userRole } from "@/db/enums"
import { users } from "@/db/schema/schema"
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabaseClient"
import { GeneralActionResponse } from "@/utils/GeneralActionResponse"
import { eq } from "drizzle-orm"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'


export const getStaffUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<GeneralActionResponse<(typeof users.$inferSelect)[]>> => {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.role, userRole.STAFF))
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
  limit: number = 10
): Promise<GeneralActionResponse<(typeof users.$inferSelect)[]>> => {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.role, userRole.ADMIN))
      .limit(limit)
      .offset((page - 1) * limit)
    return { data: result, error: null }
  } catch (error) {
    console.error(error)
    return { data: [], error: error as string }
  }
}

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
    const supabaseAdmin = createSupabaseAdminClient()
    
    // Step 1: Create Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        role: userRole.ADMIN,
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
    const { data: currentUser, error: currentUserError } = await supabase.auth.getUser()

    
    let dbResult
    try {
      dbResult = await db
        .insert(users)
        .values({
          email: user.email,
          role: userRole.ADMIN,
          fullName: user.fullName,
          authUserId: authData.user.id,
          createdBy: currentUser?.user?.user_metadata?.db_user_id || 3,
          language: "en",
          profilePictureUrl: "",
        })
        .returning()
      
      dbUserId = dbResult[0].id
    } catch (dbError) {
      console.error("Failed to create database user, rolling back auth user:", dbError)
      
      // Rollback: Delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authUserId)
      
      return { data: null, error: `Failed to create database user: ${dbError}` }
    }
    
    // Step 3: Update Auth User Metadata
    try {
      await supabaseAdmin.auth.admin.updateUserById(authData.user.id, {
        user_metadata: {
          ...authData?.user?.user_metadata,
          db_user_id: dbResult[0].id
        }
      })
    } catch (metadataError) {
      console.error("Failed to update user metadata, rolling back both auth and database user:", metadataError)
      
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
      
      return { data: null, error: `Failed to update user metadata: ${metadataError}` }
    }
    
    return { data: null, error: null }
  } catch (error) {
    console.error("Unexpected error in createAdminUser:", error)
    
    // General rollback for unexpected errors
    if (dbUserId) {
      try {
        await db.delete(users).where(eq(users.id, dbUserId))
      } catch (dbDeleteError) {
        console.error("Failed to rollback database user in general catch:", dbDeleteError)
      }
    }
    
    if (authUserId) {
      try {
        await createSupabaseAdminClient().auth.admin.deleteUser(authUserId)
      } catch (authDeleteError) {
        console.error("Failed to rollback auth user in general catch:", authDeleteError)
      }
    }
    
    return { data: null, error: error as string }
  }
}

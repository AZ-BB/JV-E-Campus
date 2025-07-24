"use server"
import { GeneralActionResponse } from "@/types/general-action-response"
import { staff, staffRoles } from "@/db/schema/schema"
import { db } from "@/db"
import { count, eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type Role = typeof staffRoles.$inferSelect & {
  number_of_staff: number
}
export const getRolesDetailed = async (
  page: number = 1,
  limit: number = 20
): Promise<GeneralActionResponse<Role[]>> => {
  try {
    const roles = await db
      .select({
        id: staffRoles.id,
        name: staffRoles.name,
        createdAt: staffRoles.createdAt,
        updatedAt: staffRoles.updatedAt,
        fullName: staffRoles.fullName,
        number_of_staff: count(staff.id),
      })
      .from(staffRoles)
      .leftJoin(staff, eq(staffRoles.id, staff.staffRoleId))
      .groupBy(staffRoles.id)
      .limit(limit)
      .offset((page - 1) * limit)
    return { data: roles, error: null }
  } catch (error) {
    console.error(error)
    return { data: null, error: "Failed to fetch roles, please try again later" as string }
  }
}
export interface RolesStats {
  total_roles: number
  active_roles: number
}
export const getRolesStats = async (): Promise<
  GeneralActionResponse<RolesStats>
> => {
  try {
    const result = await db.execute<{
      count: number
      active_count: number
    }>(sql`
      SELECT
        COUNT(*)
        FROM staff_roles
    `)
    const result2 = await db.execute<{
      count: number
    }>(sql`
      SELECT
        COUNT(*)
        FROM staff
        GROUP BY staff_role_id
    `)
    return {
      data: {
        total_roles: result.rows[0].count,
        active_roles: result2.rows.length,
      },
      error: null,
    }
  } catch (error) {
    console.error(error)
    return { data: { total_roles: 0, active_roles: 0 }, error: "Failed to fetch roles stats, please try again later" as string }
  }
}

export const createRole = async (role: { name: string, fullName: string }): Promise<GeneralActionResponse<typeof staffRoles.$inferSelect>> => {
  try {
    const result = await db.insert(staffRoles).values(role).returning()
    revalidatePath("/admin/roles")
    return { data: result[0], error: null }
  } catch (error) {
    console.error(error)
    return { data: null, error: "Unexpected error occurred, please try again later" as string }
  }
}

export const updateRole = async (roleId: number, data: { name: string, fullName: string }): Promise<GeneralActionResponse<typeof staffRoles.$inferSelect>> => {
  try {
    const result = await db.update(staffRoles).set(data).where(eq(staffRoles.id, roleId)).returning()
    revalidatePath("/admin/roles")
    return { data: result[0], error: null }
  } catch (error) {
    console.error(error)
    return { data: null, error: "Unexpected error occurred, please try again later" as string }
  }
}

export const deleteRole = async (roleId: number): Promise<GeneralActionResponse<void>> => {
  try {
    const result = await db.select({
      staffCount: count(staff.id),
    }).from(staff).where(eq(staff.staffRoleId, roleId))
    console.log("Result", result)
    if (result[0]?.staffCount > 0) {
      console.error("Role has staff, please remove staff from this role first")
      return { data: null, error: "Role has staff, please remove staff from this role first" as string }
    }
    await db.delete(staffRoles).where(eq(staffRoles.id, roleId))
    revalidatePath("/admin/roles")
    return { data: null, error: null }
  } catch (error) {
    console.error(error)
    return { data: null, error: "Unexpected error occurred, please try again later" as string }
  }
}

export const getRolesDropList = async (): Promise<GeneralActionResponse<{ label: string, value: number }[]>> => {
  try {
    const roles = await db.select({
      value: staffRoles.id,
      label: staffRoles.name,
    }).from(staffRoles)
    return { data: roles, error: null }
  } catch (error) {
    console.error(error)
    return { data: null, error: "Failed to fetch roles, please try again later" as string }
  }
}
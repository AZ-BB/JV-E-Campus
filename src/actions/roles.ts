"use server"
import { GeneralActionResponse } from "@/types/general-action-response"
import { staff, staffRoles } from "@/db/schema/schema"
import { db } from "@/db"
import { asc, count, desc, eq, ilike, or, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import responses from "@/responses/responses"
import { Logger } from "@/utils/logger"
import { getCurrentUser } from "@/utils/utils"


export type Role = typeof staffRoles.$inferSelect & {
  number_of_staff: number
}
export const getRolesDetailed = async ({
  page = 1,
  limit = 10,
  search = "",
  orderBy = 'createdAt',
  orderDirection = "desc",
}: {
  page?: number
  limit?: number
  search?: string,
  orderBy?: keyof Role,
  orderDirection?: "asc" | "desc",
}): Promise<GeneralActionResponse<{ rows: Role[], count: number, numberOfPages: number }>> => {
  try {

    const tx = await db.transaction(async (tx) => {

      const rolesSelection = {
        id: staffRoles.id,
        name: staffRoles.name,
        createdAt: staffRoles.createdAt,
        updatedAt: staffRoles.updatedAt,
        fullName: staffRoles.fullName,
        number_of_staff: count(staff.id),
      } as const

      const query = tx.select(rolesSelection).from(staffRoles)
        .leftJoin(staff, eq(staffRoles.id, staff.staffRoleId))
        .groupBy(staffRoles.id)


      if (search) {
        query.where(or(ilike(staffRoles.name, `%${search}%`), ilike(staffRoles.fullName, `%${search}%`)))
      }

      const orderByColumn = rolesSelection[orderBy as keyof typeof rolesSelection] || staffRoles.createdAt
      const rows = await query.limit(limit).offset((page - 1) * limit).orderBy(orderDirection === "asc" ? asc(orderByColumn) : desc(orderByColumn))

      const rowsCount = await tx.select({ count: count() }).from(staffRoles)

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
    return { data: null, error: responses.role.fetchedAll.error.general }
  }
}

export const getRolesNames = async (): Promise<GeneralActionResponse<{ id: number, name: string }[]>> => {
  try {
    const roles = await db.select({
      id: staffRoles.id,
      name: staffRoles.name,
    }).from(staffRoles)
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
    return { data: { total_roles: 0, active_roles: 0 }, error: responses.role.fetchedAll.error.general }
  }
}

export const createRole = async (role: { name: string, fullName: string }): Promise<GeneralActionResponse<typeof staffRoles.$inferSelect>> => {
  try {
    const result = await db.insert(staffRoles).values(role).returning()

    // LOG
    const currentUser = await getCurrentUser()
    Logger.log({
      type: "CREATE_ROLE",
      actorId: currentUser?.user?.user_metadata?.db_user_id || 1,
      actedOnId: result[0].id,
      actedOnType: "ROLE",
      message: "Role created with name: " + result[0].name,
    })

    revalidatePath("/admin/roles")
    return { data: result[0], error: null, message: responses.role.created.success }
  } catch (error) {
    console.error(error)
    return { data: null, error: responses.role.created.error.general }
  }
}

export const updateRole = async (roleId: number, data: { name: string, fullName: string }): Promise<GeneralActionResponse<typeof staffRoles.$inferSelect>> => {
  try {
    const result = await db
      .update(staffRoles)
      .set(data)
      .where(eq(staffRoles.id, roleId)).returning()

    if (!result[0]) {
      console.error("Role not found")
      return { data: null, error: 'Role not found' }
    }

    // LOG
    const currentUser = await getCurrentUser()
    Logger.log({
      type: "UPDATE_ROLE",
      actorId: currentUser?.user?.user_metadata?.db_user_id || 1,
      actedOnId: roleId,
      actedOnType: "ROLE",
      message: "Role updated with id: " + result[0].id + " and name: " + result[0].name,
    })

    revalidatePath("/admin/roles")
    return { data: result[0], error: null, message: responses.role.updated.success }

  } catch (error) {
    console.error(error)
    return { data: null, error: responses.role.updated.error.general }
  }
}

export const deleteRole = async (roleId: number): Promise<GeneralActionResponse<void>> => {
  try {
    const result = await db
      .select({
        staffCount: count(staff.id),
        name: staffRoles.name,
      })
      .from(staff)
      .where(eq(staff.staffRoleId, roleId))


    if (result[0]?.staffCount > 0) {
      console.error("Role has staff, please remove staff from this role first")
      return { data: null, error: responses.role.deleted.error.hasStaff }
    }

    await db.delete(staffRoles).where(eq(staffRoles.id, roleId))

    // LOG
    const currentUser = await getCurrentUser()
    Logger.log({
      type: "DELETE_ROLE",
      actorId: currentUser?.user?.user_metadata?.db_user_id || 1,
      actedOnId: roleId,
      actedOnType: "ROLE",
      message: "Role deleted with id: " + roleId + " and name: " + result[0].name,
    })

    revalidatePath("/admin/roles")
    return { data: null, error: null, message: responses.role.deleted.success }
  } catch (error) {
    console.error(error)
    return { data: null, error: responses.role.deleted.error.general }
  }
}
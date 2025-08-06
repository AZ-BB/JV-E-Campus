import { db } from "@/db"
import { modules, modulesRoles, staffRoles, users } from "@/db/schema/schema"
import { GeneralActionResponse } from "@/types/general-action-response"
import { aliasedTable, and, asc, count, desc, eq, ilike, inArray, sql, SQL } from "drizzle-orm"

// GET
export async function getModules({
    page = 1,
    limit = 10,
    search = "",
    orderBy = "createdAt",
    orderDirection = "desc",
    filters = {
        roleIds: []
    }
}: {
    page: number
    limit: number
    search: string
    orderBy: keyof typeof modules.$inferSelect
    orderDirection: 'asc' | 'desc'
    filters: {
        roleIds: number[]
    }
}): Promise<GeneralActionResponse<{
    rows: typeof modules.$inferSelect[]
    count: number
    numberOfPages: number
}>> {
    try {
        const conditions: SQL[] = []

        if (search) {
            conditions.push(ilike(modules.name, `%${search}%`))
        }

        if (filters?.roleIds?.length > 0) {
            conditions.push(inArray(modulesRoles.roleId, filters.roleIds))
        }

        const tx = await db.transaction(async (tx) => {

            const query = tx.select({
                id: modules.id,
                name: modules.name,
                slogan: modules.slogan,
                description: modules.description,
                iconUrl: modules.iconUrl,
                createdAt: modules.createdAt,
                updatedAt: modules.updatedAt,
                createdBy: modules.createdBy,
                updatedBy: modules.updatedBy,

                createdByFullName: users.fullName,
            })
                .from(modules)
                .leftJoin(modulesRoles, eq(modules.id, modulesRoles.moduleId))
                .leftJoin(users, eq(modules.createdBy, users.id))
                .where(and(...conditions))
                .groupBy(modules.id, users.fullName)
                .orderBy(orderDirection === 'asc' ? asc(modules[orderBy]) : desc(modules[orderBy]))
                .limit(limit)
                .offset((page - 1) * limit)

            const rows = await query

            const rowsCount = await tx
                .select({
                    count: sql<number>`count(*)`.mapWith(Number)
                })
                .from(
                    tx
                        .select({ id: modules.id })
                        .from(modules)
                        .leftJoin(modulesRoles, eq(modules.id, modulesRoles.moduleId))
                        .where(and(...conditions))
                        .groupBy(modules.id)
                        .as('sub')
                );

            return { rows, rowsCount: rowsCount[0]?.count || 0 }
        })

        return {
            data: {
                rows: tx.rows,
                count: tx.rowsCount,
                numberOfPages: Math.ceil(tx.rowsCount / limit)
            },
            error: null,
        }
    }

    catch (error) {
        console.error(error)
        return {
            data: null,
            error: error instanceof Error ? error.message : "An unknown error occurred"
        }
    }
}

export async function getModule(id: number): Promise<GeneralActionResponse<typeof modules.$inferSelect & {
    roles: {
        roleId: number
        roleName: string
    }[]
    createdByFullName: string
    updatedByFullName: string
}>> {
    try {

        const usersCreator = aliasedTable(users, "usersCreator");
        const usersUpdater = aliasedTable(users, "usersUpdater");

        const module = await db
            .select({
                id: modules.id,
                name: modules.name,
                slogan: modules.slogan,
                description: modules.description,
                iconUrl: modules.iconUrl,
                createdAt: modules.createdAt,
                updatedAt: modules.updatedAt,
                createdBy: modules.createdBy,
                updatedBy: modules.updatedBy,

                createdByFullName: usersCreator.fullName,
                updatedByFullName: usersUpdater.fullName,
            })
            .from(modules)
            .leftJoin(usersCreator, eq(modules.createdBy, usersCreator.id))
            .leftJoin(usersUpdater, eq(modules.updatedBy, usersUpdater.id))
            .where(eq(modules.id, id))

        const moduleRoles = await db
            .select({
                roleId: modulesRoles.roleId,
                roleName: staffRoles.name
            })
            .from(modulesRoles)
            .leftJoin(staffRoles, eq(modulesRoles.roleId, staffRoles.id))
            .where(eq(modulesRoles.moduleId, id))
            .groupBy(modulesRoles.roleId, staffRoles.name)

        return {
            data: {
                ...module[0],
                roles: moduleRoles.map((role) => ({
                    roleId: role.roleId || 0,
                    roleName: role.roleName || ""
                })),
                createdByFullName: module[0].createdByFullName || "N/A",
                updatedByFullName: module[0].updatedByFullName || "N/A",
            },
            error: null
        }
    } catch (error) {
        console.error(error)
        return {
            data: null,
            error: error instanceof Error ? error.message : "An unknown error occurred"
        }
    }
}

// CREATE

// UPDATE

// DELETE

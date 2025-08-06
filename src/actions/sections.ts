import { db } from "@/db"
import { modules, modulesRoles, sections, staffRoles, users } from "@/db/schema/schema"
import { GeneralActionResponse } from "@/types/general-action-response"
import { aliasedTable, and, asc, count, desc, eq, ilike, inArray, sql, SQL } from "drizzle-orm"


// GET
export async function getSections(moduleId: number, {
    page = 1,
    limit = 10,
    search = "",
    sort = "createdAt",
    order = "desc"
}: {
    page?: number
    limit?: number
    search?: string
    sort?: keyof typeof sections.$inferSelect
    order?: "asc" | "desc"
}): Promise<GeneralActionResponse<{
    rows: typeof sections.$inferSelect[]
    count: number
    numberOfPages: number
}>> {
    try {

        const conditions: SQL[] = [eq(sections.moduleId, moduleId)]
        if (search) {
            conditions.push(ilike(sections.name, `%${search}%`))
        }

        const tx = await db.transaction(async (tx) => {
            const rows = await tx.select()
                .from(sections)
                .where(conditions.length > 1 ? and(...conditions) : conditions[0]!)
                .orderBy(order === "asc" ? asc(sections[sort]) : desc(sections[sort]))
                .limit(limit)
                .offset((page - 1) * limit)

            const rowsCount = await tx.select({ count: count() }).from(sections).where(conditions.length > 1 ? and(...conditions) : conditions[0]!)

            return {
                rows,
                count: rowsCount[0].count,
                numberOfPages: Math.ceil(rowsCount[0].count / limit)
            }
        })

        return {
            data: tx,
            error: null
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
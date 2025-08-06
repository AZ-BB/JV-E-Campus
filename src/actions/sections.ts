import { db } from "@/db"
import { lessons, modules, modulesRoles, sections, staffRoles, users } from "@/db/schema/schema"
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

export async function getSection(id: number): Promise<GeneralActionResponse<typeof sections.$inferSelect & {
    module: {
        id: number
        name: string
    }
    lessons: {
        id: number
        name: string
        type: string
        duration: number | null
        description: string | null
    }[]
    lessonsCount: number
    createdByFullName: string
    updatedByFullName: string
}>> {
    try {
        const usersCreator = aliasedTable(users, "usersCreator");
        const usersUpdater = aliasedTable(users, "usersUpdater");

        const section = await db
            .select({
                id: sections.id,
                name: sections.name,
                level: sections.level,
                description: sections.description,
                moduleId: sections.moduleId,
                createdAt: sections.createdAt,
                updatedAt: sections.updatedAt,
                createdBy: sections.createdBy,
                updatedBy: sections.updatedBy,

                moduleName: modules.name,
                createdByFullName: usersCreator.fullName,
                updatedByFullName: usersUpdater.fullName,
            })
            .from(sections)
            .leftJoin(modules, eq(sections.moduleId, modules.id))
            .leftJoin(usersCreator, eq(sections.createdBy, usersCreator.id))
            .leftJoin(usersUpdater, eq(sections.updatedBy, usersUpdater.id))
            .where(eq(sections.id, id))

        if (!section[0]) {
            return {
                data: null,
                error: "Section not found"
            }
        }

        const sectionLessons = await db
            .select({
                id: lessons.id,
                name: lessons.name,
                type: lessons.type,
                duration: lessons.duration,
                description: lessons.description
            })
            .from(lessons)
            .where(eq(lessons.sectionId, id))
            .orderBy(asc(lessons.createdAt))

        const lessonsCount = await db
            .select({ count: count() })
            .from(lessons)
            .where(eq(lessons.sectionId, id))

        return {
            data: {
                ...section[0],
                module: {
                    id: section[0].moduleId || 0,
                    name: section[0].moduleName || "N/A"
                },
                lessons: sectionLessons.map((lesson) => ({
                    id: lesson.id,
                    name: lesson.name,
                    type: lesson.type || "VIDEO",
                    duration: lesson.duration,
                    description: lesson.description
                })),
                lessonsCount: lessonsCount[0]?.count || 0,
                createdByFullName: section[0].createdByFullName || "N/A",
                updatedByFullName: section[0].updatedByFullName || "N/A",
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


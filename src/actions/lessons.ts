import { db } from "@/db"
import { lessons } from "@/db/schema/schema"
import { GeneralActionResponse } from "@/types/general-action-response"
import { and, asc, count, desc, eq, ilike, SQL } from "drizzle-orm"


// GET
export async function getLessons(sectionId: number, {
    page = 1,
    limit = 10,
    search = "",
    sort = "createdAt",
    order = "desc"
}: {
    page?: number
    limit?: number
    search?: string
    sort?: keyof typeof lessons.$inferSelect
    order?: "asc" | "desc"
}): Promise<GeneralActionResponse<{
    rows: typeof lessons.$inferSelect[]
    count: number
    numberOfPages: number
}>> {
    try {

        const conditions: SQL[] = [eq(lessons.sectionId, sectionId)]
        if (search) {
            conditions.push(ilike(lessons.name, `%${search}%`))
        }

        const tx = await db.transaction(async (tx) => {
            const rows = await tx.select()
                .from(lessons)
                .where(conditions.length > 1 ? and(...conditions) : conditions[0]!)
                .orderBy(order === "asc" ? asc(lessons[sort]) : desc(lessons[sort]))
                .limit(limit)
                .offset((page - 1) * limit)

            const rowsCount = await tx.select({ count: count() }).from(lessons).where(conditions.length > 1 ? and(...conditions) : conditions[0]!)

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

export async function getLesson(lessonId: number): Promise<GeneralActionResponse<typeof lessons.$inferSelect>> {
    try {
        const lesson = await db.select().from(lessons).where(eq(lessons.id, lessonId))
        return {
            data: lesson[0],
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

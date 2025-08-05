import { db } from "@/db";
import { UserRole } from "@/db/enums";
import { actionLogs, users } from "@/db/schema/schema";
import { GeneralActionResponse } from "@/types/general-action-response";
import { getCurrentUser } from "@/utils/utils";
import { count, desc, eq } from "drizzle-orm";

export async function getDashboardData(): Promise<GeneralActionResponse<{
    totalUsers: number
    totalAdmins: number
    totalStaff: number
    lastActivity: string
    recentLogs: typeof actionLogs.$inferSelect[]
}>> {

    try {
        const user = await getCurrentUser()

        if (!user) {
            return {
                error: "No session found",
                data: null,
            }
        }

        const tx = await db.transaction(async (tx) => {
            const totalUsers = await tx.select({ count: count() }).from(users)
            const totalAdmins = await tx.select({ count: count() }).from(users).where(eq(users.role, UserRole.ADMIN))
            const totalStaff = await tx.select({ count: count() }).from(users).where(eq(users.role, UserRole.STAFF))

            const recentLogs = await tx.select().from(actionLogs).orderBy(desc(actionLogs.date)).limit(8)

            return {
                totalUsers: totalUsers[0].count,
                totalAdmins: totalAdmins[0].count,
                totalStaff: totalStaff[0].count,
                recentLogs: recentLogs
            }
        })

        return {
            data: {
                totalUsers: tx.totalUsers,
                totalAdmins: tx.totalAdmins,
                totalStaff: tx.totalStaff,
                recentLogs: tx.recentLogs,
                lastActivity: tx.recentLogs[0]?.date
            },
            error: null,
        }

    } catch (error) {
        console.error(error)
        return {
            data: null,
            error: "Error fetching dashboard data",
        }
    }
}
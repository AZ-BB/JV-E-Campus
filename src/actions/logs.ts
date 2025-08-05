import { db } from "@/db";
import { actionLogs } from "@/db/schema/schema";
import { GeneralActionResponse } from "@/types/general-action-response";
import { count, desc, eq, ilike, and, or, SQL } from "drizzle-orm";

type AdminLogType =
    'DELETE_ADMIN_USER' |
    'CREATE_ADMIN_USER' |
    'UPDATE_ADMIN_USER'

type StaffLogType =
    'DELETE_STAFF_USER' |
    'CREATE_STAFF_USER' |
    'UPDATE_STAFF_USER'

type BranchLogType =
    'CREATE_BRANCH' |
    'UPDATE_BRANCH' |
    'DELETE_BRANCH'

type RoleLogType =
    'CREATE_ROLE' |
    'UPDATE_ROLE' |
    'DELETE_ROLE'

type LogType = AdminLogType | StaffLogType | BranchLogType | RoleLogType

type ActedOnType = 'ADMIN_USER' | 'STAFF_USER' | 'BRANCH' | 'ROLE'


// GET
export async function getLogs({
    actorId,
    page = 1,
    limit = 10,
    search = "",
    logType = "",
    actedOnType = "",
    orderBy = "date",
    orderDirection = "desc"
}: {
    actorId?: number;
    page?: number;
    limit?: number;
    search?: string;
    logType?: string;
    actedOnType?: string;
    orderBy?: "date" | "type" | "message";
    orderDirection?: "asc" | "desc";
}): Promise<GeneralActionResponse<{
    logs: typeof actionLogs.$inferSelect[];
    logsCount: number;
}>> {
    try {
        const tx = await db.transaction(async (tx) => {
            // Build where conditions
            const conditions: SQL[] = actorId ? [eq(actionLogs.actorId, actorId)] : [];

            // Add search filter
            if (search) {
                conditions.push(
                    or(
                        ilike(actionLogs.message, `%${search}%`),
                        ilike(actionLogs.type, `%${search}%`)
                    )!
                );
            }

            // Add log type filter
            if (logType) {
                conditions.push(eq(actionLogs.type, logType));
            }

            // Add acted on type filter
            if (actedOnType) {
                conditions.push(eq(actionLogs.actedOnType, actedOnType));
            }

            const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

            // Build order by
            const orderByColumn = actionLogs[orderBy];
            const orderClause = orderDirection === "asc" ? orderByColumn : desc(orderByColumn);

            const rows = await tx
                .select()
                .from(actionLogs)
                .where(whereClause)
                .orderBy(orderClause)
                .limit(limit)
                .offset((page - 1) * limit);

            const rowsCount = await tx.select({ count: count() }).from(actionLogs).where(whereClause);

            return {
                logs: rows,
                logsCount: rowsCount[0].count
            }
        })

        return {
            data: {
                logs: tx.logs,
                logsCount: tx.logsCount
            },
            error: null
        };
    } catch (error) {
        console.error(error);
        return {
            data: null,
            error: "Error fetching logs"
        };
    }
}

// CREATE
export async function createLog({
    type,
    actorId,
    actedOnId,
    actedOnType,
    message,
    metadata
}: {
    type: LogType;
    actorId: number;
    actedOnId?: number;
    actedOnType?: ActedOnType;
    message: string;
    metadata?: Record<string, any>;
}) {
    try {
        const result = await db
            .insert(actionLogs)
            .values({
                type,
                actorId,
                actedOnId,
                actedOnType,
                message,
                metadata: metadata || {}
            });

        return {
            data: result,
            error: null
        };
    } catch (error) {
        console.error(error);
        return {
            data: null,
            error: "Error creating log"
        };
    }
}
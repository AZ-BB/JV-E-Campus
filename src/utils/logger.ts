import { db } from "@/db";
import { actionLogs } from "@/db/schema/schema";
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

export const Logger = {
    log: async ({
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
    }) => {
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
        return result;
    },
    getLogs: async ({
        actorId,
        page = 1,
        limit = 10,
        search = "",
        logType = "",
        actedOnType = "",
        orderBy = "date",
        orderDirection = "desc"
    }: {
        actorId: number;
        page?: number;
        limit?: number;
        search?: string;
        logType?: string;
        actedOnType?: string;
        orderBy?: "date" | "type" | "message";
        orderDirection?: "asc" | "desc";
    }) => {
        // Build where conditions
        const conditions: SQL[] = [eq(actionLogs.actorId, actorId)];

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

        const result = await db
            .select()
            .from(actionLogs)
            .where(whereClause)
            .orderBy(orderClause)
            .limit(limit)
            .offset((page - 1) * limit);
        
        return result;
    },
    getLogsCount: async ({
        actorId,
        search = "",
        logType = "",
        actedOnType = ""
    }: {
        actorId: number;
        search?: string;
        logType?: string;
        actedOnType?: string;
    }) => {
        // Build where conditions (same logic as getLogs)
        const conditions: SQL[] = [eq(actionLogs.actorId, actorId)];

        if (search) {
            conditions.push(
                or(
                    ilike(actionLogs.message, `%${search}%`),
                    ilike(actionLogs.type, `%${search}%`)
                )!
            );
        }

        if (logType) {
            conditions.push(eq(actionLogs.type, logType));
        }

        if (actedOnType) {
            conditions.push(eq(actionLogs.actedOnType, actedOnType));
        }

        const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

        const result = await db
            .select({ count: count() })
            .from(actionLogs)
            .where(whereClause);
        
        return result[0].count;
    },
    getSystemLogs: async ({
        page = 1,
        limit = 10,
        search = "",
        logType = "",
        actedOnType = "",
        orderBy = "date",
        orderDirection = "desc"
    }: {
        page?: number;
        limit?: number;
        search?: string;
        logType?: string;
        actedOnType?: string;
        orderBy?: "date" | "type" | "message";
        orderDirection?: "asc" | "desc";
    } = {}) => {
        // Build where conditions (similar to getLogs but without actorId filter)
        const conditions: SQL[] = [];

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

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Build order by
        const orderByColumn = actionLogs[orderBy];
        const orderClause = orderDirection === "asc" ? orderByColumn : desc(orderByColumn);

        const result = await db
            .select()
            .from(actionLogs)
            .where(whereClause)
            .orderBy(orderClause)
            .limit(limit)
            .offset((page - 1) * limit);
        
        return result;
    },
    getSystemLogsCount: async ({
        search = "",
        logType = "",
        actedOnType = ""
    }: {
        search?: string;
        logType?: string;
        actedOnType?: string;
    } = {}) => {
        // Build where conditions (same logic as getSystemLogs)
        const conditions: SQL[] = [];

        if (search) {
            conditions.push(
                or(
                    ilike(actionLogs.message, `%${search}%`),
                    ilike(actionLogs.type, `%${search}%`)
                )!
            );
        }

        if (logType) {
            conditions.push(eq(actionLogs.type, logType));
        }

        if (actedOnType) {
            conditions.push(eq(actionLogs.actedOnType, actedOnType));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const result = await db
            .select({ count: count() })
            .from(actionLogs)
            .where(whereClause);
        
        return result[0].count;
    },
    // Unified function that can get logs for specific actor or system-wide
    getUnifiedLogs: async ({
        actorId,
        page = 1,
        limit = 10,
        search = "",
        logType = "",
        actedOnType = "",
        orderBy = "date",
        orderDirection = "desc"
    }: {
        actorId?: number; // Optional - if provided, gets logs for specific actor
        page?: number;
        limit?: number;
        search?: string;
        logType?: string;
        actedOnType?: string;
        orderBy?: "date" | "type" | "message";
        orderDirection?: "asc" | "desc";
    } = {}) => {
        // Build where conditions
        const conditions: SQL[] = [];

        // Add actor filter if provided
        if (actorId) {
            conditions.push(eq(actionLogs.actorId, actorId));
        }

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

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Build order by
        const orderByColumn = actionLogs[orderBy];
        const orderClause = orderDirection === "asc" ? orderByColumn : desc(orderByColumn);

        const result = await db
            .select()
            .from(actionLogs)
            .where(whereClause)
            .orderBy(orderClause)
            .limit(limit)
            .offset((page - 1) * limit);
        
        return result;
    },
    // Unified count function
    getUnifiedLogsCount: async ({
        actorId,
        search = "",
        logType = "",
        actedOnType = ""
    }: {
        actorId?: number; // Optional - if provided, gets count for specific actor
        search?: string;
        logType?: string;
        actedOnType?: string;
    } = {}) => {
        // Build where conditions (same logic as getUnifiedLogs)
        const conditions: SQL[] = [];

        // Add actor filter if provided
        if (actorId) {
            conditions.push(eq(actionLogs.actorId, actorId));
        }

        if (search) {
            conditions.push(
                or(
                    ilike(actionLogs.message, `%${search}%`),
                    ilike(actionLogs.type, `%${search}%`)
                )!
            );
        }

        if (logType) {
            conditions.push(eq(actionLogs.type, logType));
        }

        if (actedOnType) {
            conditions.push(eq(actionLogs.actedOnType, actedOnType));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const result = await db
            .select({ count: count() })
            .from(actionLogs)
            .where(whereClause);
        
        return result[0].count;
    }
} 
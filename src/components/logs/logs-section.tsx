import { Logger } from "@/utils/logger";
import LogsTable from "./logs-table";
import LogsFilter from "./logs-filter";

interface LogsSectionProps {
    actorId?: number; // Optional - if provided, shows logs for specific actor
    title: string;
    icon: React.ReactNode;
    searchParams: {
        page?: string;
        limit?: string;
        search?: string;
        logType?: string;
        actedOnType?: string;
    };
    searchPlaceholder?: string;
}

export default async function LogsSection({ 
    actorId,
    title,
    icon,
    searchParams,
    searchPlaceholder = "Search logs..."
}: LogsSectionProps) {
    // Extract search parameters
    const page = parseInt(searchParams.page || "1");
    const limit = parseInt(searchParams.limit || "10");
    const search = searchParams.search || "";
    const logType = searchParams.logType || "";
    const actedOnType = searchParams.actedOnType || "";

    // Fetch logs with filtering and pagination
    const [logs, logsCount] = await Promise.all([
        Logger.getUnifiedLogs({
            actorId, // Will be undefined for system-wide logs
            page,
            limit,
            search,
            logType,
            actedOnType
        }),
        Logger.getUnifiedLogsCount({
            actorId, // Will be undefined for system-wide logs
            search,
            logType,
            actedOnType
        })
    ]);

    const numberOfPages = Math.ceil(logsCount / limit);

    return (
        <div className="bg-admin-surface border border-admin-border rounded-lg p-6">
            <LogsFilter searchPlaceholder={searchPlaceholder}>
                <h2 className="text-xl font-semibold text-admin-text flex items-center gap-2">
                    {icon}
                    {title} ({logsCount})
                </h2>
            </LogsFilter>
            
            <LogsTable 
                logs={logs} 
                currentPage={page}
                pageSize={limit}
                totalCount={logsCount}
                numberOfPages={numberOfPages}
                showActor={!actorId} // Show actor column for system-wide logs only
            />
        </div>
    );
}
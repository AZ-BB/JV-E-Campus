import LogsSection from "@/components/logs/logs-section";
import LogsSkeleton from "@/components/logs/logs-skeleton";
import { Activity } from "lucide-react";
import { Suspense } from "react";

export default async function LogsPage({
    searchParams,
}: {
    searchParams: Promise<{
        page: string
        limit: string
        search: string
        logType: string
        actedOnType: string
    }>
}) {

    const {
        page = 1,
        limit = 10,
        search = "",
        logType = "",
        actedOnType = "",
    } = await searchParams

    return <div className="flex flex-col gap-4">
        <div>
            <h1 className="text-3xl font-bold text-admin-text mb-2">Logs</h1>
            <p className="text-admin-text-muted">Overview of system logs</p>
        </div>

        <div className="overflow-y-auto">
            <Suspense fallback={<LogsSkeleton />}>
                <LogsSection
                    title="Logs"
                    icon={<Activity className="w-4 h-4" />}
                    searchParams={{
                        page: page.toString(),
                        limit: limit.toString(),
                        search: search,
                        logType: logType,
                        actedOnType: actedOnType
                    }}
                />
            </Suspense>
        </div>

    </div>
}
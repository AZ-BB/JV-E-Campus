interface LogsSkeletonProps {
    showActor?: boolean; // Whether to show the actor column (for system-wide logs)
    title?: string;
    rowCount?: number;
}

export default function LogsSkeleton({ 
    showActor = false, 
    title = "Activity Logs", 
    rowCount = 10 
}: LogsSkeletonProps) {
    return (
        <div className="bg-admin-surface border border-admin-border rounded-lg p-6">
            <div className="space-y-4">
                {/* Filter Skeleton */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center gap-4 py-4">
                        <div className="mt-5">
                            <div className="h-7 w-48 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                        </div>
                    </div>

                    {/* Filter Row Skeleton */}
                    <div className="flex items-center justify-between gap-4 pb-4 border-b border-admin-border">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-20 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                <div className="h-9 w-48 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="h-4 w-20 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                <div className="h-9 w-40 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center gap-4">
                            <div className="h-9 w-60 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Table Skeleton */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-admin-border">
                                <th className="text-left py-3 px-4">
                                    <div className="h-4 w-16 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                </th>
                                {showActor && (
                                    <th className="text-left py-3 px-4">
                                        <div className="h-4 w-16 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                    </th>
                                )}
                                <th className="text-left py-3 px-4">
                                    <div className="h-4 w-20 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                </th>
                                <th className="text-left py-3 px-4">
                                    <div className="h-4 w-16 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                </th>
                                <th className="text-left py-3 px-4">
                                    <div className="h-4 w-20 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                </th>
                                <th className="w-8 py-3 px-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Skeleton Rows */}
                            {Array.from({ length: rowCount }).map((_, index) => (
                                <tr key={index} className="border-b border-admin-border">
                                    <td className="py-3 px-4">
                                        <div className="h-6 w-24 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded-full"></div>
                                    </td>
                                    {showActor && (
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                                <div className="h-4 w-20 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                            </div>
                                        </td>
                                    )}
                                    <td className="py-3 px-4">
                                        <div className="space-y-1">
                                            <div className="h-4 w-48 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                            <div className="h-3 w-20 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-4 w-32 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-6 w-12 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-4 w-4 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Skeleton */}
                    <div className="mt-6">
                        <div className="w-full flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-16 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                <div className="h-7 w-16 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                <div className="h-4 w-12 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                <div className="h-4 w-8 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                                <div className="h-4 w-20 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded"></div>
                            </div>

                            <div className="flex items-center">
                                {/* Pagination buttons skeleton */}
                                <div className="h-7 w-7 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded-l"></div>
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="h-7 w-7 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse"></div>
                                ))}
                                <div className="h-7 w-7 bg-gray-200 dark:bg-admin-textMuted/10 animate-pulse rounded-r"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
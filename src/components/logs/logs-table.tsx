"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Calendar,
    ChevronDown,
    ChevronRight,
    Eye,
    User
} from "lucide-react";
import Pagination from "../pagination";
import { Table } from "../ui/table";
import { actionLogs } from "@/db/schema/schema";

interface LogsTableProps {
    logs: typeof actionLogs.$inferSelect[];
    pagination?: boolean;
    currentPage: number;
    pageSize: number;
    totalCount: number;
    numberOfPages: number;
    showActor?: boolean;
    enableExpanding?: boolean;
}

export default function LogsTable({
    logs,
    currentPage,
    pageSize,
    totalCount,
    numberOfPages,
    showActor = false,
    pagination = true,
    enableExpanding = true
}: LogsTableProps) {
    const router = useRouter();
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    // Get badge color based on action type
    const getBadgeColor = (logType: string) => {
        if (logType.includes('CREATE')) {
            return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-800/60 dark:text-green-200 dark:border-green-700';
        } else if (logType.includes('DELETE')) {
            return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-800/60 dark:text-red-200 dark:border-red-700';
        } else if (logType.includes('UPDATE')) {
            return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-800/60 dark:text-orange-200 dark:border-orange-700';
        }
        return 'bg-admin-primary/10 text-admin-primary border-admin-primary/20';
    };

    const toggleRow = (logId: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(logId)) {
            newExpanded.delete(logId);
        } else {
            newExpanded.add(logId);
        }
        setExpandedRows(newExpanded);
    };

    const getActionUrl = (log: any) => {
        if (!log.actedOnId || !log.actedOnType) return null;

        switch (log.actedOnType) {
            case 'ADMIN_USER':
                return `/admin/users/${log.actedOnId}`;
            case 'STAFF_USER':
                return `/admin/staff/${log.actedOnId}`;
            case 'ROLE':
                return `/admin/roles`;
            case 'BRANCH':
                return `/admin/branches`;
            default:
                return null;
        }
    };

    const getActorUrl = (log: any) => {
        if (!log.actorId) return null;
        return `/admin/users/${log.actorId}`;
    };

    if (!logs || logs.length === 0) {
        return (
            <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-admin-textMuted mx-auto mb-3" />
                <p className="text-admin-textMuted">No activity logs found.</p>
            </div>
        );
    }

    // Define headers for the table
    const headers = [
        {
            label: "Action",
            key: "type",
            componentKey: "action",
            cell: (value: string) => (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(value)}`}>
                    {value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </span>
            )
        },
        ...(showActor ? [{
            label: "Actor",
            key: "actorId",
            componentKey: "actor",
            cell: (value: string, row: any) => {
                const actorUrl = getActorUrl(row);
                return (
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-admin-textMuted" />
                        {actorUrl ? (
                            <Link
                                href={actorUrl}
                                className="text-admin-primary hover:text-admin-primary/80 text-sm font-medium"
                            >
                                Admin #{value}
                            </Link>
                        ) : (
                            <span className="text-admin-text text-sm">Admin #{value}</span>
                        )}
                    </div>
                );
            }
        }] : []),
        {
            label: "Target",
            key: "message",
            componentKey: "target",
            cell: (value: string, row: any) => (
                <div className="flex flex-col">
                    <span className="text-admin-text text-sm">{value}</span>
                    {row.actedOnType && (
                        <span className="text-admin-textMuted text-xs">
                            {row.actedOnType.replace(/_/g, ' ').toLowerCase()}
                        </span>
                    )}
                </div>
            )
        },
        {
            label: "Date",
            key: "date",
            componentKey: "date",
            cell: (value: string) => (
                <span className="text-admin-textMuted text-sm">
                    {value ? new Date(value).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : "Unknown"}
                </span>
            )
        },
        {
            label: "Actions",
            key: "actions",
            componentKey: "actions",
            cell: (value: any, row: any) => {
                const actionUrl = getActionUrl(row);
                return (
                    <>
                        {!row.type.includes('DELETE') && actionUrl && (
                            <Link
                                href={actionUrl}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-admin-primary/10 text-admin-primary hover:bg-admin-primary/20 rounded transition-colors"
                            >
                                <Eye className="w-3 h-3" />
                                View
                            </Link>
                        )}
                    </>
                );
            }
        },
        {
            label: "",
            key: "expand",
            componentKey: "expand",
            cell: (value: any, row: any) => {
                const metadata = row.metadata as Record<string, any> | null;
                const hasMetadata = metadata && typeof metadata === 'object' && metadata !== null && Object.keys(metadata).length > 0;
                const isExpanded = expandedRows.has(row.id.toString());
                
                return (
                    <>
                        {enableExpanding && hasMetadata && (
                            <button
                                onClick={() => toggleRow(row.id.toString())}
                                className="p-1 hover:bg-admin-primary/10 rounded transition-colors"
                            >
                                {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-admin-textMuted" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-admin-textMuted" />
                                )}
                            </button>
                        )}
                    </>
                );
            }
        }
    ];

    // Transform logs data to include id as number for the Table component
    const tableData = logs.map((log, index) => ({
        ...log,
        id: typeof log.id === 'string' ? parseInt(log.id) || index : log.id || index
    }));

    return (
        <div>
            <Table
                headers={headers}
                data={tableData}
            />
            
            {/* Expanded rows for metadata */}
            {logs.map((log) => {
                const isExpanded = expandedRows.has(log.id);
                const metadata = log.metadata as Record<string, any> | null;
                const hasMetadata = metadata && typeof metadata === 'object' && metadata !== null && Object.keys(metadata).length > 0;
                
                return isExpanded && hasMetadata ? (
                    <div key={`expanded-${log.id}`} className="bg-admin-surface/30 border-b border-admin-border">
                        <div className="py-3 px-4">
                            <div className="text-sm">
                                <div className="text-admin-textMuted mb-2 font-medium">Metadata:</div>
                                <pre className="p-3 bg-admin-background rounded text-xs overflow-auto border border-admin-border">
                                    {JSON.stringify(metadata, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                ) : null;
            })}

            {/* Pagination */}
            {pagination && totalCount > 0 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        maxPage={numberOfPages}
                        onChange={(page) => {
                            const params = new URLSearchParams(window.location.search);
                            params.set("page", page.toString());
                            router.push(`?${params.toString()}`, { scroll: false });
                        }}
                        onSizeChange={(size) => {
                            const params = new URLSearchParams(window.location.search);
                            params.set("limit", size.toString());
                            params.set("page", "1"); // Reset to first page when changing size
                            router.push(`?${params.toString()}`, { scroll: false });
                        }}
                        rowsCount={totalCount}
                    />
                </div>
            )}
        </div>
    );
}
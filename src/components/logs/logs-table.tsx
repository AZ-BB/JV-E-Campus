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

interface LogsTableProps {
    logs: any[];
    currentPage: number;
    pageSize: number;
    totalCount: number;
    numberOfPages: number;
    showActor?: boolean; // Whether to show the actor column (for system-wide logs)
}

export default function LogsTable({ 
    logs, 
    currentPage, 
    pageSize, 
    totalCount, 
    numberOfPages,
    showActor = false
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

    const colSpan = showActor ? 6 : 5;

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-admin-border">
                        <th className="text-left py-3 px-4 font-medium text-admin-text text-sm">Action</th>
                        {showActor && (
                            <th className="text-left py-3 px-4 font-medium text-admin-text text-sm">Actor</th>
                        )}
                        <th className="text-left py-3 px-4 font-medium text-admin-text text-sm">Target</th>
                        <th className="text-left py-3 px-4 font-medium text-admin-text text-sm">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-admin-text text-sm">Actions</th>
                        <th className="w-8 py-3 px-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => {
                        const isExpanded = expandedRows.has(log.id);
                        const actionUrl = getActionUrl(log);
                        const actorUrl = getActorUrl(log);
                        const metadata = log.metadata as Record<string, any> | null;
                        const hasMetadata = metadata && typeof metadata === 'object' && metadata !== null && Object.keys(metadata).length > 0;

                        return (
                            <React.Fragment key={log.id}>
                                <tr className="border-b border-admin-border hover:bg-admin-surface/50 transition-colors">
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(log.type)}`}>
                                            {log.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                        </span>
                                    </td>
                                    {showActor && (
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-admin-textMuted" />
                                                {actorUrl ? (
                                                    <Link
                                                        href={actorUrl}
                                                        className="text-admin-primary hover:text-admin-primary/80 text-sm font-medium"
                                                    >
                                                        Admin #{log.actorId}
                                                    </Link>
                                                ) : (
                                                    <span className="text-admin-text text-sm">Admin #{log.actorId}</span>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                    <td className="py-3 px-4">
                                        <div className="flex flex-col">
                                            <span className="text-admin-text text-sm">{log.message}</span>
                                            {log.actedOnType && (
                                                <span className="text-admin-textMuted text-xs">
                                                    {log.actedOnType.replace(/_/g, ' ').toLowerCase()}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-admin-textMuted text-sm">
                                            {log.date ? new Date(log.date).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : "Unknown"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {actionUrl && (
                                            <Link
                                                href={actionUrl}
                                                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-admin-primary/10 text-admin-primary hover:bg-admin-primary/20 rounded transition-colors"
                                            >
                                                <Eye className="w-3 h-3" />
                                                View
                                            </Link>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {hasMetadata && (
                                            <button
                                                onClick={() => toggleRow(log.id)}
                                                className="p-1 hover:bg-admin-primary/10 rounded transition-colors"
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown className="w-4 h-4 text-admin-textMuted" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4 text-admin-textMuted" />
                                                )}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                {isExpanded && hasMetadata && (
                                    <tr className="bg-admin-surface/30">
                                        <td colSpan={colSpan} className="py-3 px-4">
                                            <div className="text-sm">
                                                <div className="text-admin-textMuted mb-2 font-medium">Metadata:</div>
                                                <pre className="p-3 bg-admin-background rounded text-xs overflow-auto border border-admin-border">
                                                    {JSON.stringify(metadata, null, 2)}
                                                </pre>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>

            {/* Pagination */}
            {totalCount > 0 && (
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
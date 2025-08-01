"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import Input from "../ui/input";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValue } from "../ui/select";

const LOG_TYPES = [
    { value: "ALL", label: "All Actions" },
    { value: "CREATE_ADMIN_USER", label: "Create Admin User" },
    { value: "UPDATE_ADMIN_USER", label: "Update Admin User" },
    { value: "DELETE_ADMIN_USER", label: "Delete Admin User" },
    { value: "CREATE_STAFF_USER", label: "Create Staff User" },
    { value: "UPDATE_STAFF_USER", label: "Update Staff User" },
    { value: "DELETE_STAFF_USER", label: "Delete Staff User" },
    { value: "CREATE_BRANCH", label: "Create Branch" },
    { value: "UPDATE_BRANCH", label: "Update Branch" },
    { value: "DELETE_BRANCH", label: "Delete Branch" },
    { value: "CREATE_ROLE", label: "Create Role" },
    { value: "UPDATE_ROLE", label: "Update Role" },
    { value: "DELETE_ROLE", label: "Delete Role" },
];

const ACTED_ON_TYPES = [
    { value: "ALL", label: "All Targets" },
    { value: "ADMIN_USER", label: "Admin Users" },
    { value: "STAFF_USER", label: "Staff Users" },
    { value: "BRANCH", label: "Branches" },
    { value: "ROLE", label: "Roles" },
];

interface LogsFilterProps {
    children: React.ReactNode;
    searchPlaceholder?: string;
}

export default function LogsFilter({
    children,
    searchPlaceholder = "Search logs..."
}: LogsFilterProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [logType, setLogType] = useState("");
    const [actedOnType, setActedOnType] = useState("");

    // Initialize from URL params
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const searchParam = params.get("search");
        const logTypeParam = params.get("logType");
        const actedOnTypeParam = params.get("actedOnType");

        if (searchParam) setSearch(searchParam);
        if (logTypeParam) setLogType(logTypeParam);
        if (actedOnTypeParam) setActedOnType(actedOnTypeParam);

        // Set defaults if no params
        if (!logTypeParam) setLogType("ALL");
        if (!actedOnTypeParam) setActedOnType("ALL");
    }, []);

    // Handle search with debounce
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const debouncedSearch = debounce(() => {
            if (search) {
                params.set("search", search);
            } else {
                params.delete("search");
            }
            params.set("page", "1"); // Reset to first page when searching
            router.push(`?${params.toString()}`, { scroll: false });
        }, 500);

        debouncedSearch();

        return () => {
            debouncedSearch.cancel();
        };
    }, [search, router]);

    // Handle filter changes
    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search);

        if (value && value !== "ALL") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1"); // Reset to first page when filtering
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center gap-4 py-4">
                <div className="mt-5">
                    {children}
                </div>
            </div>

            {/* Filter Row */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-admin-border">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-admin-text">Action Type:</label>
                        <SelectRoot
                            value={logType}
                            onValueChange={(value) => {
                                setLogType(value);
                                handleFilterChange("logType", value);
                            }}
                        >
                            <SelectTrigger className="w-48 h-9 bg-admin-surface border-admin-border text-sm">
                                <SelectValue placeholder="All Actions" />
                            </SelectTrigger>
                            <SelectContent>
                                {LOG_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectRoot>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-admin-text">Target Type:</label>
                        <SelectRoot
                            value={actedOnType}
                            onValueChange={(value) => {
                                setActedOnType(value);
                                handleFilterChange("actedOnType", value);
                            }}
                        >
                            <SelectTrigger className="w-40 h-9 bg-admin-surface border-admin-border text-sm">
                                <SelectValue placeholder="All Targets" />
                            </SelectTrigger>
                            <SelectContent>
                                {ACTED_ON_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectRoot>
                    </div>
                </div>

                <div className="flex justify-between items-center gap-4">
                    <Input
                        placeholder={searchPlaceholder}
                        className="w-60 h-9 bg-admin-surface border-admin-border text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {(search || (logType && logType !== "ALL") || (actedOnType && actedOnType !== "ALL")) && (
                    <button
                        onClick={() => {
                            setSearch("");
                            setLogType("ALL");
                            setActedOnType("ALL");
                            const params = new URLSearchParams(window.location.search);
                            params.delete("search");
                            params.delete("logType");
                            params.delete("actedOnType");
                            params.set("page", "1");
                            router.push(`?${params.toString()}`, { scroll: false });
                        }}
                        className="text-sm text-admin-primary hover:text-admin-primary/80 underline"
                    >
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
}
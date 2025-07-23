import { ChevronLeft, ChevronRight } from "lucide-react";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValue } from "./select";
import { Select } from "radix-ui";

export default function Pagination({
    currentPage,
    maxPage,
    onChange,
    pageSize,
    onSizeChange
}: {
    currentPage: number;
    maxPage: number;
    onChange: (page: number) => void;
    pageSize: number;
    onSizeChange: (size: number) => void;
}) {
    const getVisiblePages = () => {
        const pages = [];
        const maxVisible = 3; // Show fewer pages for more compact design

        let start = Math.max(1, currentPage - 1);
        let end = Math.min(maxPage, start + maxVisible - 1);

        // Adjust start if we're near the end
        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex space-x-2">
            <div className="flex items-center gap-1">
                <span className="text-sm text-admin-text-muted">Page size:</span>
                <SelectRoot onSelect={(value) => onSizeChange(Number(value))}>
                    <SelectTrigger className="w-12 h-7 text-sm text-admin-text-muted bg-admin-surface border border-admin-border hover:bg-admin-border">
                        <SelectValue className="text-admin-text-muted" placeholder={`${pageSize}`} />
                    </SelectTrigger>
                    <SelectContent className="w-10">
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                </SelectRoot>
            </div>

            <div className="flex items-center">
                {/* Previous Button */}
                <button
                    onClick={() => onChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="h-7 w-7 flex items-center justify-center text-sm text-admin-text-muted bg-admin-surface border border-admin-border rounded-l hover:bg-admin-border disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-admin-border"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {
                    currentPage > 2 && (
                        <>
                            <button
                                key={1}
                                onClick={() => onChange(1)}
                                className={`h-7 w-7 text-sm text-admin-text-muted bg-admin-surface border border-admin-border hover:bg-admin-border`}
                            >
                                1
                            </button>

                            <button
                                className={`cursor-default h-7 w-7 text-sm border border-admin-border bg-admin-surface text-admin-text-muted`}
                            >
                                ...
                            </button>
                        </>
                    )
                }


                {/* Page Numbers */}
                {visiblePages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onChange(page)}
                        className={`h-7 w-7 text-sm border ${page === currentPage
                            ? "bg-blue-500 text-white border-blue-500"
                            : "text-admin-text-muted bg-admin-surface border-admin-border hover:bg-admin-border"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {
                    currentPage < maxPage - 1 && (
                        <>
                            <button
                                className={`cursor-default h-7 w-7 text-sm border border-admin-border bg-admin-surface text-admin-text-muted`}
                            >
                                ...
                            </button>

                            <button
                                key={maxPage}
                                onClick={() => onChange(maxPage)}
                                className={`h-7 w-7 text-sm text-admin-text-muted bg-admin-surface border border-admin-border hover:bg-admin-border`}
                            >
                                {maxPage}
                            </button>
                        </>
                    )
                }

                {/* Next Button */}
                <button
                    onClick={() => onChange(currentPage + 1)}
                    disabled={currentPage >= maxPage}
                    className="h-7 w-7 flex items-center justify-center text-sm text-admin-text-muted bg-admin-surface border border-admin-border rounded-r hover:bg-admin-border disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-admin-border"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
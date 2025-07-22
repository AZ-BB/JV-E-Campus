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
            <div>
                <SelectRoot onSelect={(value) => onSizeChange(Number(value))}>
                    <SelectTrigger className="w-12 h-7 text-sm text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700">
                        <SelectValue className="text-gray-300" placeholder={`${pageSize}`} />
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
                    className="h-7 w-7 flex items-center justify-center text-sm text-gray-300 bg-gray-800 border border-gray-700 rounded-l hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {
                    currentPage > 2 && (
                        <>
                            <button
                                key={1}
                                onClick={() => onChange(1)}
                                className={`h-7 w-7 text-sm text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700`}
                            >
                                1
                            </button>

                            <button
                                className={`cursor-default h-7 w-7 text-sm border border-gray-700 bg-gray-900 text-gray-400`}
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
                            : "text-gray-300 bg-gray-800 border-gray-700 hover:bg-gray-700"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {
                    currentPage < maxPage - 1 && (
                        <>
                            <button
                                className={`cursor-default h-7 w-7 text-sm border border-gray-700 bg-gray-900 text-gray-400`}
                            >
                                ...
                            </button>

                            <button
                                key={maxPage}
                                onClick={() => onChange(maxPage)}
                                className={`h-7 w-7 text-sm text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700`}
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
                    className="h-7 w-7 flex items-center justify-center text-sm text-gray-300 bg-gray-800 border border-gray-700 rounded-r hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
import { ChevronUp } from "lucide-react";
import * as React from "react";

const TableRoot = React.forwardRef<
    HTMLTableElement,
    React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table
                ref={ref}
                className={`min-w-full divide-y divide-admin-border ${className}`}
                {...props}
            />
        </div>
    </div>
));
TableRoot.displayName = "TableRoot";

const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({
    className,
    ...props }, ref) => (
    <thead
        ref={ref}
        className={`bg-admin-surface ${className}`}
        {...props}
    />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={`bg-admin-surface divide-y divide-admin-border ${className}`}
        {...props}
    />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={`bg-admin-surface border-t border-admin-border font-medium ${className}`}
        {...props}
    />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={className}
        {...props}
    />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={`px-6 bg-admin-primary text-white py-3 text-left text-xs font-medium text-admin-text-muted uppercase tracking-wider ${className}`}
        {...props}
    />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={`px-6 py-4 whitespace-nowrap text-sm text-admin-text ${className}`}
        {...props}
    />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
    HTMLTableCaptionElement,
    React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        className={`mt-2 text-sm text-admin-text-muted ${className}`}
        {...props}
    />
));
TableCaption.displayName = "TableCaption";


function Table({
    headers,
    data = [],
    onSort,
    onRowClick,
}: {
    headers: {
        label: string;
        key: string;
        cell?: (value: any, row: any) => React.ReactNode;
        sortable?: boolean;
        sorted?: boolean;
        order?: "asc" | "desc";
        componentKey?: string;
    }[];
    data: { id: number, [key: string]: any }[];
    onSort?: (column: string) => void;
    onRowClick?: (row: any) => void;
}) {
    return (
        <TableRoot>
            <TableHeader>
                <TableRow>
                    {headers.map((header) => (
                        <TableHead key={header.componentKey} onClick={() => header.sortable ? onSort?.(header.key) : null}>
                            <div className={`flex justify-between items-center gap-2 font-medium ${header.sortable ? "cursor-pointer" : ""}`}>
                                <span>
                                    {header.label}
                                </span>
                                <span>
                                    {
                                        (header.sortable && header.sorted) ?
                                            (
                                                <ChevronUp className={`w-4 h-4 ${header.order === "asc" ? "rotate-180" : ""}`} />
                                            ) : null
                                    }
                                </span>
                            </div>
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row) => (
                    <TableRow 
                        key={row.id} 
                        className={`hover:bg-admin-border transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                        onClick={() => onRowClick?.(row)}
                    >
                        {headers.map((header) => (
                            <TableCell key={header.componentKey}>{header.cell ? header.cell(row[header.key], row) : row[header.key]}</TableCell>
                        ))}
                    </TableRow>
                ))}

                {
                    data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={headers.length} className="text-center">No data</TableCell>
                        </TableRow>
                    )
                }
            </TableBody>
        </TableRoot>
    )
}


export {
    TableRoot,
    TableHeader,
    TableBody,
    TableFooter,
    TableRow,
    TableHead,
    TableCell,
    TableCaption,
    Table
};

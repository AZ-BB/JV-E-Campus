import { ChevronUp } from "lucide-react";
import * as React from "react";

const TableRoot = React.forwardRef<
    HTMLTableElement,
    React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
    <div className="overflow-x-auto">
        <table
            ref={ref}
            className={`w-full border-collapse ${className}`}
            {...props}
        />
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
        className={className}
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
        className={className}
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
        className={`border-t border-admin-border font-medium ${className}`}
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
        className={`text-left py-3 px-4 font-medium text-admin-text text-sm ${className}`}
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
        className={`py-3 px-4 text-sm text-admin-text ${className}`}
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
        cell?: (value: any, row?: any) => React.ReactNode;
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
                <TableRow className="border border-admin-border bg-admin-surface">
                    {headers.map((header) => (
                        <TableHead key={header.componentKey} onClick={() => header.sortable ? onSort?.(header.key) : null}>
                            <div className={`flex items-center gap-2 ${header.sortable ? "cursor-pointer" : ""}`}>
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
            <TableBody className="border border-admin-border">
                {data.map((row) => (
                    <TableRow
                        key={row.id}
                        className={`border-b border-admin-border hover:bg-admin-surface/50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                        onClick={() => onRowClick?.(row)}
                    >
                        {headers.map((header) => (
                            <TableCell key={header.componentKey}>{header.cell ? header.cell(row[header.key], row) : row[header.key]}</TableCell>
                        ))}
                    </TableRow>
                ))}

                {
                    data.length === 0 && (
                        <TableRow className="border border-admin-border rounded-b-lg">
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

import { ChevronUp } from "lucide-react";
import * as React from "react";

const TableRoot = React.forwardRef<
    HTMLTableElement,
    React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
        <table
            ref={ref}
            className={`w-full caption-bottom text-xs ${className}`}
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
        className={`[&_tr]:border-b ${className}`}
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
        className={`[&_tr:last-child]:border-0 ${className}`}
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
        className={`border-t font-medium [&>tr]:last:border-b-0 ${className}`}
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
        className={`border-b border-gray-700 transition-colors ${className}`}
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
        className={`h-8 px-2 py-1 text-left align-middle text-white text-xs [&:has([role=checkbox])]:pr-0 ${className}`}
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
        className={`px-2 py-1.5 align-middle text-xs [&:has([role=checkbox])]:pr-0 ${className}`}
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
        className={`mt-2 text-xs ${className}`}
        {...props}
    />
));
TableCaption.displayName = "TableCaption";


function Table({
    headers,
    data,
    onSort,
}: {
    headers: {
        label: string;
        key: string;
        cell?: (value: any) => React.ReactNode;
        sortable?: boolean;
        sorted?: boolean;
        order?: "asc" | "desc";
    }[];
    data: { id: number, [key: string]: any }[];
    onSort?: (column: string) => void;
}) {
    return (
        <TableRoot>
            <TableHeader>
                <TableRow>
                    {headers.map((header) => (
                        <TableHead key={header.key} onClick={() => onSort?.(header.key)}>
                            <div className={`flex justify-between items-center gap-2 font-normal ${header.sortable ? "cursor-pointer" : ""}`}>
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
                    <TableRow key={row.id}>
                        {headers.map((header) => (
                            <TableCell key={header.key}>{header.cell ? header.cell(row[header.key]) : row[header.key]}</TableCell>
                        ))}
                    </TableRow>
                ))}
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

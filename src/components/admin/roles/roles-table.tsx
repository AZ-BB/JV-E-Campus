'use client'
import { TableRoot, TableHeader, TableBody, TableRow, TableCell, TableHead, Table } from "@/components/ui/table";
import { GeneralActionResponse } from "@/types/general-action-response";
import { ChevronUp, ChevronLeft, ChevronRight, Pencil, Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "../../ui/pagination";
import Button from "../../ui/button";
import { Role } from "@/actions/roles";

export default function RolesTable({
    roles
}: {
    roles: GeneralActionResponse<Role[]>
}) {

    const query = useSearchParams()
    const sort = query.get("sort") || "id"
    const order = query.get("order") || "asc"
    const page = query.get("page") || "1"
    const pageSize = query.get("page_size") || "10"
    const router = useRouter()

    return (
        <div>
            <Table
                headers={[
                    {
                        label: "ID",
                        key: "id",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "id",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Name",
                        key: "name",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "name",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Full Name",
                        key: "fullName",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "fullName",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Staff Count",
                        key: "staffCount",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "staffCount",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Actions",
                        key: "id",
                        cell: (value) => (
                            <div className="flex gap-2">
                                <Button className="w-8 h-8">
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button className="w-8 h-8" onClick={() => {
                                    console.log("Delete", value)
                                }}>
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                        ),
                    }
                ]}
                data={roles.data || []}
                onSort={(column) => {
                    const newOrder = order === "asc" ? "desc" : "asc"
                    const newQuery = new URLSearchParams(query)
                    newQuery.set("sort", column)
                    newQuery.set("order", newOrder)
                    router.push(`?${newQuery.toString()}`, { scroll: false })
                }}
            />

            <div className="mt-4 w-full flex justify-end">
                <Pagination
                    currentPage={Number(page)}
                    pageSize={Number(pageSize)}
                    maxPage={10}
                    onChange={(page) => {
                        console.log("Changed to page:", page)
                        // You can integrate this with your routing logic
                        const newQuery = new URLSearchParams(query)
                        newQuery.set("page", page.toString())
                        router.push(`?${newQuery.toString()}`, { scroll: false })
                    }}
                    onSizeChange={(size) => {
                        console.log("Changed to size:", size)
                        const newQuery = new URLSearchParams(query)
                        newQuery.set("page_size", size.toString())
                        router.push(`?${newQuery.toString()}`, { scroll: false })
                    }}
                />
            </div>

        </div>
    )
}
'use client'
import { TableRoot, TableHeader, TableBody, TableRow, TableCell, TableHead, Table } from "@/components/ui/table";
import { GeneralActionResponse } from "@/types/general-action-response";
import { ChevronUp, ChevronLeft, ChevronRight, Pencil, Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "../../ui/pagination";
import Button from "../../ui/button";
import { Staff } from "@/actions/users";

export default function StaffTable({
    staffUsers
}: {
    staffUsers: GeneralActionResponse<Staff[]>
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
                        componentKey: "id",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "id",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Name",
                        key: "fullName",
                        componentKey: "fullName",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "fullName",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Email",
                        key: "email",
                        componentKey: "email",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "email",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Language",
                        key: "language",
                        componentKey: "language",
                        sortable: false,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "language",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Role",
                        key: "staffRoleName",
                        componentKey: "staffRoleName",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "staffRoleName",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Branch",
                        key: "branchName",
                        componentKey: "branchName",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "branchName",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Nationality",
                        key: "nationality",
                        componentKey: "nationality",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "nationality",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Phone Number",
                        key: "phoneNumber",
                        componentKey: "phoneNumber",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "phoneNumber",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Created At",
                        key: "createdAt",
                        componentKey: "createdAt",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "createdAt",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Updated At",
                        key: "updatedAt",
                        componentKey: "updatedAt",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "updatedAt",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Created By",
                        key: "createdByName",
                        componentKey: "createdByName",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "createdByName",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Actions",
                        key: "id",
                        componentKey: "actions",
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
                data={staffUsers.data || []}
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
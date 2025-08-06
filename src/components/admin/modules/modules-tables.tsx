'use client'

import Pagination from "@/components/pagination"
import { GeneralActionResponse } from "@/types/general-action-response"
import { modules } from '@/db/schema/schema'
import Button from "@/components/ui/button"
import { Table } from "@/components/ui/table"
import { useRouter, useSearchParams } from "next/navigation"
import Avatar from "@/components/ui/avatar"
import { mapAvatarImageUrl } from "@/utils/utils"
import { Pencil, RefreshCcw, Trash } from "lucide-react"

export default function ModulesTables({
    data,
}: {
    data: GeneralActionResponse<{ rows: typeof modules.$inferSelect[], count: number, numberOfPages: number }>
}) {

    const router = useRouter()
    const query = useSearchParams()

    const sort = query.get("sort") || "id"
    const order = query.get("order") || "asc"
    const page = query.get("page") || "1"
    const pageSize = query.get("limit") || "10"

    return (
        <div>
            <Table
                onRowClick={(row) => {
                    router.push(`/admin/modules/${row.id}`)
                }}
                headers={[
                    {
                        label: "ID",
                        key: "id",
                        componentKey: "id",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "id",
                        order: order === "asc" ? "desc" : "asc",
                    },
                    {
                        label: "",
                        key: "iconUrl",
                        componentKey: "iconUrl",
                        sortable: false,
                        cell: (value, row) => (
                            <div className="flex justify-center items-center min-h-8 min-w-8">
                                <Avatar
                                    src={mapAvatarImageUrl(value) || ""}
                                    alt="Profile Picture"
                                    className="w-8 h-8 "
                                    fallback={row.name.split(" ").slice(0, 2).map((name: string) => name[0]).join("") || "N/A"}
                                />
                            </div>
                        ),
                    },
                    {
                        label: "Name",
                        key: "name",
                        componentKey: "name",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "name",
                        order: order === "asc" ? "desc" : "asc",
                    },
                    {
                        label: "Slogan",
                        key: "slogan",
                        componentKey: "slogan",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "slogan",
                        order: order === "asc" ? "desc" : "asc",
                    },
                    {
                        label: "Description",
                        key: "description",
                        componentKey: "description",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "description",
                        order: order === "asc" ? "desc" : "asc",
                    },
                    {
                        label: "Created At",
                        key: "createdAt",
                        componentKey: "createdAt",
                        sortable: true,
                        cell: (value) => <div>{value.split(" ")[0]}</div>,
                        sorted: sort === "createdAt",
                        order: order === "asc" ? "desc" : "asc",
                    },
                    {
                        label: "Created By",
                        key: "createdByFullName",
                        componentKey: "createdByFullName",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        sorted: sort === "createdByFullName",
                        order: order === "asc" ? "desc" : "asc",
                    },
                    {
                        label: "Actions",
                        key: "id",
                        componentKey: "actions",
                        cell: (value) => (
                            <div className="flex gap-2">
                                <Button
                                    className="inline-flex items-center gap-1 px-2 py-2 text-xs bg-admin-primary/10 text-admin-primary hover:bg-admin-primary/20 rounded transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                    }}
                                >
                                    <Pencil className="w-3 h-3" />
                                </Button>
                                <div
                                >
                                    <Button
                                        className="inline-flex items-center gap-1 px-2 py-2 text-xs bg-admin-accent/10 text-admin-accent hover:bg-admin-accent/20 rounded transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            // handleDeleteClick(value)
                                        }}
                                    >
                                        <Trash className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        ),
                    },
                ]}
                data={data.data?.rows || []}
                onSort={(column) => {
                    const newOrder = order === "asc" ? "desc" : "asc"
                    const newQuery = new URLSearchParams(query)
                    newQuery.set("sort", column)
                    newQuery.set("order", newOrder)
                    router.push(`?${newQuery.toString()}`, { scroll: false })
                }}
            />

            <Pagination
                rowsCount={data.data?.count || 0}
                currentPage={Number(page)}
                pageSize={Number(pageSize)}
                maxPage={data.data?.numberOfPages || 1}
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
                    newQuery.set("limit", size.toString())
                    router.push(`?${newQuery.toString()}`, { scroll: false })
                }}
            />

        </div>
    )
}
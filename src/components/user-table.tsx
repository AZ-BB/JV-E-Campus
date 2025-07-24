'use client'
import { Table } from "@/components/ui/table";
import { GeneralActionResponse } from "@/types/general-action-response";
import { Pencil, Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "./pagination";
import Button from "./ui/button";
import toaster from "./ui/toast";

interface User {
    id: number
    fullName: string
    email: string
    role: string
    language?: string | null
    profilePictureUrl?: string | null
    createdAt?: string | null
}

export default function UserTable({
    users
}: {
    users: GeneralActionResponse<User[]>
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
                        componentKey: "id",
                        sorted: sort === "id",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Name",
                        key: "fullName",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        componentKey: "fullName",
                        sorted: sort === "fullName",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Email",
                        key: "email",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        componentKey: "email",
                        sorted: sort === "email",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Language",
                        key: "language",
                        sortable: false,
                        cell: (value) => <div>{value}</div>,
                        componentKey: "language",
                        sorted: sort === "language",
                        order: order === "asc" ? "desc" : "asc"
                    },
                    {
                        label: "Created At",
                        key: "createdAt",
                        sortable: true,
                        cell: (value) => <div>{value}</div>,
                        componentKey: "createdAt",
                        sorted: sort === "createdAt",
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
                data={users.data || []}
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
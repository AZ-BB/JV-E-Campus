"use client"
import {
    Table,
} from "@/components/ui/table"
import { GeneralActionResponse } from "@/types/general-action-response"
import {
    Pencil,
    Trash,
    Plus,
    RefreshCcw,
    User,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useRef } from "react"
import Pagination from "@/components/pagination"
import Button from "@/components/ui/button"
import DeleteDialog from "@/components/delete-dialog"
import Avatar from "@/components/ui/avatar"
import toaster from "@/components/ui/toast"
import { mapAvatarImageUrl } from "@/utils/utils"
import { Admin, deleteAdminUser } from "@/actions/admins"
import AdminsFilter from "./admin-filter"
import CreateAdminModal from "./create-admin-modal"
import UpdateAdminModal from "./update-admin-modal"
import { UsersStats as UsersStatsType } from "@/actions/admins"
import UsersStats from "./admin-stats"

export default function AdminsTable({
    admins,
    usersStats,
}: {
    admins: GeneralActionResponse<{ rows: Admin[], count: number, numberOfPages: number }>
    usersStats: GeneralActionResponse<UsersStatsType>
}) {
    const router = useRouter()
    const query = useSearchParams()

    const sort = query.get("sort") || "id"
    const order = query.get("order") || "asc"
    const page = query.get("page") || "1"
    const pageSize = query.get("limit") || "10"

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

    const [updateUserData, setUpdateUserData] = useState<Admin | null>(null)

    const deleteButtonRefs = useRef<Record<string, HTMLDivElement | null>>({})
    const [deleteConfirm, setDeleteConfirm] = useState<{
        isOpen: boolean
        staffId: string | undefined
    }>({
        isOpen: false,
        staffId: undefined,
    })

    const handleDeleteClick = (staffId: string) => {
        setDeleteConfirm({
            isOpen: true,
            staffId,
        })
    }

    const handleDeleteConfirm = async () => {
        console.log("Delete confirmed for staff ID:", deleteConfirm.staffId)
        if (deleteConfirm.staffId) {
            console.log("Delete confirmed for staff ID:", deleteConfirm.staffId)
            const response = await deleteAdminUser(Number(deleteConfirm.staffId))
            if (response.error) {
                toaster.error(response.error)
            } else {
                response.message && toaster.success(response.message)
            }
        }
        setDeleteConfirm({ isOpen: false, staffId: undefined })
    }

    const handleDeleteCancel = () => {
        setDeleteConfirm({ isOpen: false, staffId: undefined })
    }

    return (
        <>
            <UsersStats usersStats={usersStats}>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-admin-primary text-admin-textSecondary px-3 py-1.5 rounded-md hover:bg-admin-primary/80 disabled:hover:bg-admin-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4" />
                        Create Admin
                    </Button>
                    <Button
                        onClick={() => {
                            router.refresh()
                        }}
                        className="flex items-center gap-2 bg-admin-secondary text-admin-textSecondary px-3 py-1.5 rounded-md hover:bg-admin-secondary/80 disabled:hover:bg-admin-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Refresh
                    </Button>
                </div>
            </UsersStats>
            <div className="relative">
                {/* Create Staff Button */}
                <AdminsFilter />

                <Table
                    onRowClick={(row) => {
                        router.push(`/admin/users/${row.id}`)
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
                            key: "profilePictureUrl",
                            componentKey: "profilePictureUrl",
                            sortable: false,
                            cell: (value, row) => (
                                <div className="flex items-center justify-center min-w-8 min-h-8">
                                    <Avatar
                                        src={mapAvatarImageUrl(value) || ""}
                                        alt="Profile Picture"
                                        className="w-8 h-8"
                                        fallback={row.fullName.split(" ").slice(0, 2).map((name: string) => name[0]).join("") || "N/A"}
                                    />
                                </div>
                            ),
                        },
                        {
                            label: "Name",
                            key: "fullName",
                            componentKey: "fullName",
                            sortable: true,
                            cell: (value) => <div>{value}</div>,
                            sorted: sort === "fullName",
                            order: order === "asc" ? "desc" : "asc",
                        },
                        {
                            label: "Email",
                            key: "email",
                            componentKey: "email",
                            sortable: true,
                            cell: (value) => <div>{value}</div>,
                            sorted: sort === "email",
                            order: order === "asc" ? "desc" : "asc",
                        },
                        {
                            label: "Role",
                            key: "role",
                            componentKey: "role",
                            sortable: true,
                            cell: (value) => <div>{value}</div>,
                            sorted: sort === "role",
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
                        // {
                        //     label: "Updated At",
                        //     key: "updatedAt",
                        //     componentKey: "updatedAt",
                        //     sortable: true,
                        //     cell: (value) => <div>{value}</div>,
                        //     sorted: sort === "updatedAt",
                        //     order: order === "asc" ? "desc" : "asc"
                        // },
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
                                            setUpdateUserData(
                                                admins.data?.rows?.find(
                                                    (admin) => admin.id === Number(value)
                                                ) || null
                                            )
                                            setIsUpdateModalOpen(true)
                                        }}
                                    >
                                        <Pencil className="w-3 h-3" />
                                    </Button>
                                    <div
                                        ref={(el) => {
                                            if (el) {
                                                deleteButtonRefs.current[value] = el
                                            }
                                        }}
                                    >
                                        <Button
                                            className="inline-flex items-center gap-1 px-2 py-2 text-xs bg-admin-accent/10 text-admin-accent hover:bg-admin-accent/20 rounded transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteClick(value)
                                            }}
                                        >
                                            <Trash className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ),
                        },
                    ]}
                    data={admins.data?.rows || []}
                    onSort={(column) => {
                        const newOrder = order === "asc" ? "desc" : "asc"
                        const newQuery = new URLSearchParams(query)
                        newQuery.set("sort", column)
                        newQuery.set("order", newOrder)
                        router.push(`?${newQuery.toString()}`, { scroll: false })
                    }}
                />

                <Pagination
                    rowsCount={admins.data?.count || 0}
                    currentPage={Number(page)}
                    pageSize={Number(pageSize)}
                    maxPage={admins.data?.numberOfPages || 1}
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

                {/* Create Staff Modal */}
                <CreateAdminModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                />
                {/* Update Staff Modal */}
                <UpdateAdminModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    userData={updateUserData}
                />
                {/* Delete Confirmation Dialog */}
                <DeleteDialog
                    handleDeleteCancel={handleDeleteCancel}
                    handleDeleteConfirm={handleDeleteConfirm}
                    deleteConfirm={deleteConfirm}
                    text="Are you sure you want to delete this admin member?"
                    buttonRef={{
                        current: deleteConfirm.staffId
                            ? deleteButtonRefs.current[deleteConfirm.staffId]
                            : null
                    }}
                />
            </div>
        </>
    )
}

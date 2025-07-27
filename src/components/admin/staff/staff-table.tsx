"use client"
import {
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Table,
} from "@/components/ui/table"
import { GeneralActionResponse } from "@/types/general-action-response"
import {
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash,
  Plus,
  RefreshCcw,
  User,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useRef } from "react"
import Pagination from "../../pagination"
import Button from "../../ui/button"
import { deleteStaffUser, Staff } from "@/actions/staff"
import CreateStaffModal from "./create-staff-modal"
import Input from "@/components/ui/input"
import UpdateStaffModal from "./update-staff-modal"
import DeleteDialog from "@/components/delete-dialog"
import Image from "next/image"
import Avatar from "@/components/ui/avatar"
import StaffFilter from "@/components/admin/staff/staff-filter"
import toaster from "@/components/ui/toast"
import { mapAvatarImageUrl } from "@/utils/utils"

export default function StaffTable({
  staffUsers,
}: {
  staffUsers: GeneralActionResponse<{ rows: Staff[], count: number, numberOfPages: number }>
}) {
  const router = useRouter()
  const query = useSearchParams()

  const sort = query.get("sort") || "id"
  const order = query.get("order") || "asc"
  const page = query.get("page") || "1"
  const pageSize = query.get("page_size") || "10"

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [updateStaffData, setUpdateStaffData] = useState<Staff | null>(null)

  const deleteButtonRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    staffId?: string
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
      const response = await deleteStaffUser(Number(deleteConfirm.staffId))
      if (response.error) {
        toaster.error(response.error)
      } else {
        response.message && toaster.success(response.message)
      }
    }
    setDeleteConfirm({ isOpen: false })
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false })
  }

  return (
    <div className="relative">
      {/* Create Staff Button */}
      <StaffFilter>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-admin-primary text-admin-textSecondary px-4 py-2 rounded-md hover:bg-admin-primary/80 disabled:hover:bg-admin-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Create Staff
          </Button>
          <Button
            onClick={() => {
              router.refresh()
            }}
            className="flex items-center gap-2 bg-admin-secondary text-admin-textSecondary px-4 py-2 rounded-md hover:bg-admin-secondary/80 disabled:hover:bg-admin-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </StaffFilter>

      <Table
        onRowClick={(row) => {
          router.push(`/admin/staff/${row.id}`)
        }}
        headers={[
          {
            label: "ID",
            key: "staffId",
            componentKey: "staffId",
            sortable: true,
            cell: (value) => <div>{value}</div>,
            sorted: sort === "staffId",
            order: order === "asc" ? "desc" : "asc",
          },
          {
            label: "",
            key: "profilePictureUrl",
            componentKey: "profilePictureUrl",
            sortable: false,
            cell: (value, row) => (
              <Avatar
                src={mapAvatarImageUrl(value) || ""}
                alt="Profile Picture"
                className="w-8 h-8"
                fallback={row.fullName.split(" ").slice(0, 2).map((name: string) => name[0]).join("") || "N/A"}
              />
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
            label: "Language",
            key: "language",
            componentKey: "language",
            sortable: false,
            cell: (value) => <div>{value}</div>,
            sorted: sort === "language",
            order: order === "asc" ? "desc" : "asc",
          },
          {
            label: "Role",
            key: "staffRoleName",
            componentKey: "staffRoleName",
            sortable: true,
            cell: (value) => <div>{value}</div>,
            sorted: sort === "staffRoleName",
            order: order === "asc" ? "desc" : "asc",
          },
          {
            label: "Branch",
            key: "branchName",
            componentKey: "branchName",
            sortable: true,
            cell: (value) => <div>{value}</div>,
            sorted: sort === "branchName",
            order: order === "asc" ? "desc" : "asc",
          },
          {
            label: "Nationality",
            key: "nationality",
            componentKey: "nationality",
            sortable: true,
            cell: (value) => <div>{value}</div>,
            sorted: sort === "nationality",
            order: order === "asc" ? "desc" : "asc",
          },
          {
            label: "Phone Number",
            key: "phoneNumber",
            componentKey: "phoneNumber",
            sortable: true,
            cell: (value) => <div>{value}</div>,
            sorted: sort === "phoneNumber",
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
            key: "createdByName",
            componentKey: "createdByName",
            sortable: true,
            cell: (value) => <div>{value}</div>,
            sorted: sort === "createdByName",
            order: order === "asc" ? "desc" : "asc",
          },
          {
            label: "User ID",
            key: "id",
            componentKey: "id",
            sortable: true,
            cell: (value) => <div>{value}</div>,
            sorted: sort === "createdByName",
            order: order === "asc" ? "desc" : "asc",
          },
          {
            label: "Actions",
            key: "id",
            componentKey: "actions",
            cell: (value, row) => (
              <div className="flex gap-2">
                <Button
                  className="w-8 h-8 flex justify-center items-center bg-admin-secondary hover:bg-admin-secondary/80"
                  onClick={() => {
                    setUpdateStaffData(row as Staff)
                    setIsUpdateModalOpen(true)
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <div 
                  ref={(el) => {
                    if (el) {
                      deleteButtonRefs.current[value] = el
                    }
                  }}
                >
                  <Button
                    className="w-8 h-8 flex justify-center items-center bg-admin-accent hover:bg-admin-accent/80"
                    onClick={() => handleDeleteClick(value)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ),
          },
        ]}
        data={staffUsers.data?.rows || []}
        onSort={(column) => {
          const newOrder = order === "asc" ? "desc" : "asc"
          const newQuery = new URLSearchParams(query)
          newQuery.set("sort", column)
          newQuery.set("order", newOrder)
          router.push(`?${newQuery.toString()}`, { scroll: false })
        }}
      />

      <Pagination
        rowsCount={staffUsers.data?.count || 0}
        currentPage={Number(page)}
        pageSize={Number(pageSize)}
        maxPage={staffUsers.data?.numberOfPages || 1}
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

      {/* Create Staff Modal */}
      <CreateStaffModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      {/* Update Staff Modal */}
      <UpdateStaffModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        staffData={updateStaffData}
      />
      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        handleDeleteCancel={handleDeleteCancel}
        handleDeleteConfirm={handleDeleteConfirm}
        deleteConfirm={deleteConfirm}
        text="Are you sure you want to delete this staff member?"
        buttonRef={{
          current: deleteConfirm.staffId 
            ? deleteButtonRefs.current[deleteConfirm.staffId] 
            : null
        }}
      />
    </div>
  )
}

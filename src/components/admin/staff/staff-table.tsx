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
import Pagination from "../../ui/pagination"
import Button from "../../ui/button"
import { deleteStaffUser, Staff } from "@/actions/users"
import CreateStaffModal from "./create-staff-modal"
import Input from "@/components/ui/input"
import UpdateStaffModal from "./update-staff-modal"
import DeleteDialog from "@/components/delete-dialog"
import Image from "next/image"
import Avatar from "@/components/ui/avatar"
import Filter from "@/components/filter"
import toaster from "@/components/ui/toast"

export default function StaffTable({
  staffUsers,
}: {
  staffUsers: GeneralActionResponse<Staff[]>
}) {
  const query = useSearchParams()
  const sort = query.get("sort") || "id"
  const order = query.get("order") || "asc"
  const page = query.get("page") || "1"
  const pageSize = query.get("page_size") || "10"
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    staffId: string | null
    position: { top: number; left: number } | null
  }>({
    isOpen: false,
    staffId: null,
    position: null,
  })
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [updateStaffData, setUpdateStaffData] = useState<Staff | null>(null)
  const handleDeleteClick = (staffId: string, event: React.MouseEvent) => {
    const button = event.currentTarget
    const buttonRect = button.getBoundingClientRect()
    const container = button.closest(".relative") as HTMLElement
    const containerRect = container?.getBoundingClientRect()

    if (!containerRect) return

    const dialogWidth = 256 // w-64 = 16rem = 256px
    const dialogHeight = 100 // Approximate height

    // Calculate position relative to the container
    const relativeButtonTop = buttonRect.top - containerRect.top
    const relativeButtonLeft = buttonRect.left - containerRect.left

    // Calculate initial position (above and centered to button)
    let top = relativeButtonTop - dialogHeight - 10
    let left = relativeButtonLeft + buttonRect.width / 2 - dialogWidth / 2

    // Adjust if dialog would go off-screen horizontally
    if (left < 10) {
      left = 10 // Keep 10px from left edge
    } else if (left + dialogWidth > containerRect.width - 10) {
      left = containerRect.width - dialogWidth - 10 // Keep 10px from right edge
    }

    // Adjust if dialog would go off-screen vertically (show below button instead)
    if (top < 10) {
      top = relativeButtonTop + buttonRect.height + 10 // Show below button with 10px gap
    }

    setDeleteConfirm({
      isOpen: true,
      staffId,
      position: { top, left },
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
    setDeleteConfirm({ isOpen: false, staffId: null, position: null })
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, staffId: null, position: null })
  }

  return (
    <div className="relative">
      {/* Create Staff Button */}
      <Filter>
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
      </Filter>

      <Table
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
              <div>
                <Avatar className="w-10 h-10" src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_NAME}/${process.env.NEXT_PUBLIC_STORAGE_AVATAR_DIRECTORY}/${value}`} alt="Profile Picture" fallback={row.fullName.split(" ")[0].charAt(0).toUpperCase() + (row.fullName.split(" ")[1]?.charAt(0).toUpperCase() || "")} />
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
            cell: (value) => (
              <div className="flex gap-2">
                <Button
                  className="w-8 h-8 flex justify-center items-center bg-admin-secondary hover:bg-admin-secondary/80"
                  onClick={() => {
                    setUpdateStaffData(
                      staffUsers.data?.find(
                        (staff) => staff.id === Number(value)
                      ) || null
                    )
                    setIsUpdateModalOpen(true)
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  className="w-8 h-8 flex justify-center items-center bg-admin-accent hover:bg-admin-accent/80"
                  onClick={(event) => handleDeleteClick(value, event)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ),
          },
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
      {deleteConfirm.isOpen && deleteConfirm.position && (
        <DeleteDialog
          handleDeleteCancel={handleDeleteCancel}
          handleDeleteConfirm={handleDeleteConfirm}
          deleteConfirm={deleteConfirm}
          text="Are you sure you want to delete this staff member?"
        />
      )}
    </div>
  )
}

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
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import Pagination from "../../pagination"
import Button from "../../ui/button"
import { deleteRole, Role, RolesStats as RolesStatsType } from "@/actions/roles"
import CreateRoleModal from "./create-role-modal"
import Input from "@/components/ui/input"
import UpdateRoleModal from "./update-role-modal"
import DeleteDialog from "@/components/delete-dialog"
import toaster from "@/components/ui/toast"
import RolesFilter from "./roles-filter"
import RolesStats from "./roles-stats"

export default function RolesTable({
  roles,
  rolesStats,
}: {
  roles: GeneralActionResponse<{ rows: Role[], count: number, numberOfPages: number }>
  rolesStats: GeneralActionResponse<RolesStatsType>
}) {
  const query = useSearchParams()
  const sort = query.get("sort") || "id"
  const order = query.get("order") || "asc"
  const page = query.get("page") || "1"
  const pageSize = query.get("limit") || "10"
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    roleId: string | null
    position: { top: number; left: number } | null
  }>({
    isOpen: false,
    roleId: null,
    position: null,
  })
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [updateRoleData, setUpdateRoleData] = useState<Role | null>(null)

  const handleDeleteClick = (roleId: string, event: React.MouseEvent) => {
    const button = event.currentTarget
    const buttonRect = button.getBoundingClientRect()
    const container = button.closest('.relative') as HTMLElement
    const containerRect = container?.getBoundingClientRect()

    if (!containerRect) return

    const dialogWidth = 256 // w-64 = 16rem = 256px
    const dialogHeight = 100 // Approximate height

    // Calculate position relative to the container
    const relativeButtonTop = buttonRect.top - containerRect.top
    const relativeButtonLeft = buttonRect.left - containerRect.left

    // Calculate initial position (above and centered to button)
    let top = relativeButtonTop - dialogHeight - 10
    let left = relativeButtonLeft + (buttonRect.width / 2) - (dialogWidth / 2)

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
      roleId,
      position: { top, left },
    })
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.roleId) {
      console.log("Delete confirmed for role ID:", deleteConfirm.roleId)
      // Add your delete logic here
      const response = await deleteRole(Number(deleteConfirm.roleId))
      if (response.error) {
        toaster.error(response.error)
      } else {
        response.message && toaster.success(response.message)
      }
    }
    setDeleteConfirm({ isOpen: false, roleId: null, position: null })
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, roleId: null, position: null })
  }

  return (
    <>
      <RolesStats rolesStats={rolesStats} >
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-admin-primary text-admin-textSecondary px-3 py-1.5 rounded-md hover:bg-admin-primary/80 disabled:hover:bg-admin-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Create Role
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-admin-secondary text-admin-textSecondary px-3 py-1.5 rounded-md hover:bg-admin-secondary/80 disabled:hover:bg-admin-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

      </RolesStats>
      <div className="relative">
        {/* Create Role Button and Search */}
        <RolesFilter />

        <Table
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
              label: "Name",
              key: "name",
              componentKey: "name",
              sortable: true,
              cell: (value) => <div>{value}</div>,
              sorted: sort === "name",
              order: order === "asc" ? "desc" : "asc",
            },
            {
              label: "Full Name",
              key: "fullName",
              componentKey: "fullName",
              sortable: true,
              cell: (value) => <div>{value}</div>,
              sorted: sort === "fullName",
              order: order === "asc" ? "desc" : "asc",
            },
            {
              label: "Staff Count",
              key: "number_of_staff",
              componentKey: "number_of_staff",
              sortable: true,
              cell: (value) => <div>{value}</div>,
              sorted: sort === "number_of_staff",
              order: order === "asc" ? "desc" : "asc",
            },
            {
              label: "Actions",
              key: "id",
              componentKey: "actions",
              cell: (value) => (
                <div className="flex gap-2">
                  <Button className="w-8 h-8 flex justify-center items-center bg-admin-secondary hover:bg-admin-secondary/80"
                    onClick={() => {
                      setUpdateRoleData(roles.data?.rows?.find((role) => role.id === Number(value)) || null)
                      setIsUpdateModalOpen(true)
                    }}>
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
          data={roles.data?.rows || []}
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
            rowsCount={roles.data?.count || 0}
            currentPage={Number(page)}
            pageSize={Number(pageSize)}
            maxPage={roles.data?.numberOfPages || 1}
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

        {/* Create Role Modal */}
        <CreateRoleModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        {/* Update Role Modal */}
        <UpdateRoleModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          roleData={updateRoleData}
        />

        {/* Delete Confirmation Dialog */}
        {deleteConfirm.isOpen && deleteConfirm.position && (
          <DeleteDialog
            handleDeleteCancel={handleDeleteCancel}
            handleDeleteConfirm={handleDeleteConfirm}
            deleteConfirm={deleteConfirm}
            text="Are you sure you want to delete this role?"
          />
        )}
      </div >
    </>
  )
}
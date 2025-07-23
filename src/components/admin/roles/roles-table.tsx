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
import Pagination from "../../ui/pagination"
import Button from "../../ui/button"
import { deleteRole, Role } from "@/actions/roles"
import CreateRoleModal from "./create-role-modal"
import Input from "@/components/ui/input"
import UpdateRoleModal from "./update-role-modal"

export default function RolesTable({
  roles,
}: {
  roles: GeneralActionResponse<Role[]>
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

  const handleDeleteConfirm = () => {
    if (deleteConfirm.roleId) {
      console.log("Delete confirmed for role ID:", deleteConfirm.roleId)
      // Add your delete logic here
      deleteRole(Number(deleteConfirm.roleId))  
    }
    setDeleteConfirm({ isOpen: false, roleId: null, position: null })
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, roleId: null, position: null })
  }
  
  return (
    <div className="relative">
      {/* Create Role Button and Search */}
      <div className="mb-4 flex justify-between">
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-admin-primary text-admin-text px-4 py-2 rounded-md hover:bg-admin-primary/80 disabled:hover:bg-admin-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Create Role
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-admin-secondary text-admin-text px-4 py-2 rounded-md hover:bg-admin-secondary/80 disabled:hover:bg-admin-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
        <div>
          <Input placeholder="Search" className="w-80 bg-admin-surface border-admin-border" />
        </div>
      </div>

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
                  setUpdateRoleData(roles.data?.find((role) => role.id === Number(value)) || null)
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
        <>
          {/* Backdrop to close dialog when clicking outside */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={handleDeleteCancel}
          />
          {/* Confirmation Dialog */}
          <div
            className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 w-64"
            style={{
              top: `${deleteConfirm.position.top}px`,
              left: `${deleteConfirm.position.left}px`,
            }}
          >
            <div className="text-center">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                Are you sure you want to delete this role?
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={handleDeleteCancel}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
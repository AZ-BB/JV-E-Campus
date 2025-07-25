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
import { Branch, deleteBranch } from "@/actions/branches"
import CreateBranchModal from "./create-branch-modal"
import Input from "@/components/ui/input"
import UpdateBranchModal from "./update-branch-modal"
import DeleteDialog from "@/components/delete-dialog"
import toaster from "@/components/ui/toast"
import BranchesFilter from "./branches-filter"

export default function BranchesTable({
  branches,
}: {
  branches: GeneralActionResponse<{ rows: Branch[], count: number, numberOfPages: number }>
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
    branchId: string | null
    position: { top: number; left: number } | null
  }>({
    isOpen: false,
    branchId: null,
    position: null,
  })
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [updateBranchData, setUpdateBranchData] = useState<Branch | null>(null)

  const handleDeleteClick = (branchId: string, event: React.MouseEvent) => {
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
      branchId,
      position: { top, left },
    })
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.branchId) {
      console.log("Delete confirmed for branch ID:", deleteConfirm.branchId)
      // Add your delete logic here
      const response = await deleteBranch(Number(deleteConfirm.branchId))
      if (response.error) {
        toaster.error(response.error)
      } else {
        response.message && toaster.success(response.message)
      }
    }
    setDeleteConfirm({ isOpen: false, branchId: null, position: null })
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, branchId: null, position: null })
  }

  return (
    <div className="relative">
      {/* Create Branch Button and Search */}
      <BranchesFilter>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-admin-primary text-admin-textSecondary px-4 py-2 rounded-md hover:bg-admin-primary/80 disabled:hover:bg-admin-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Create Branch
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-admin-secondary text-admin-textSecondary px-4 py-2 rounded-md hover:bg-admin-secondary/80 disabled:hover:bg-admin-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </BranchesFilter>

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
            label: "Staff Count",
            key: "staffCount",
            componentKey: "staffCount",
            sortable: true,
            cell: (value) => <div>{value}</div>,
            sorted: sort === "staffCount",
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
            label: "Updated At",
            key: "updatedAt",
            componentKey: "updatedAt",
            sortable: true,
            cell: (value) => <div>{value}</div>,
            sorted: sort === "updatedAt",
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
                    setUpdateBranchData(
                      branches.data?.rows.find(
                        (branch) => branch.id === Number(value)
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
        data={branches.data?.rows || []}
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
          maxPage={branches.data?.numberOfPages || 1}
          rowsCount={branches.data?.count || 0}
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

      {/* Create Branch Modal */}
      <CreateBranchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Update Branch Modal */}
      <UpdateBranchModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        branchData={updateBranchData}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.isOpen && deleteConfirm.position && (
        <DeleteDialog
          handleDeleteCancel={handleDeleteCancel}
          handleDeleteConfirm={handleDeleteConfirm}
          deleteConfirm={deleteConfirm}
          text="Are you sure you want to delete this branch?"
        />
      )}
    </div>
  )
}

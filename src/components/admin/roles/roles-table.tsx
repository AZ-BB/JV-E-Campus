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
import { Role } from "@/actions/roles"
import CreateRoleModal from "./create-role-modal"
import Input from "@/components/ui/input"

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

  return (
    <div>
      {/* Create Role Button and Search */}
      <div className="mb-4 flex justify-between">
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-admin_primary text-admin_text px-4 py-2 rounded-md hover:bg-admin_primary/80 disabled:hover:bg-admin_primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Create Role
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-admin_secondary text-admin_text px-4 py-2 rounded-md hover:bg-admin_secondary/80 disabled:hover:bg-admin_secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
        <div>
          <Input placeholder="Search" className="w-80 bg-admin_surface border-admin_border" />
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
                <Button className="w-8 h-8 flex justify-center items-center bg-admin_secondary hover:bg-admin_secondary/80">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  className="w-8 h-8 flex justify-center items-center bg-admin_accent hover:bg-admin_accent/80"
                  onClick={() => {
                    console.log("Delete", value)
                  }}
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
    </div>
  )
}
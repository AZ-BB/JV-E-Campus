"use client"
import {
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Table,
} from "@/components/ui/table"
import { GeneralActionResponse } from "@/types/general-action-response"
import { BookOpen, Calendar, User, Clock, GraduationCap } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Pagination from "../../../pagination"
import SectionsFilter from "./sections-filter"
import { sections } from "@/db/schema/schema"

type Section = typeof sections.$inferSelect

const levelColors = {
  BEGINNER: "bg-green-100 text-green-800 border-green-200",
  INTERMEDIATE: "bg-yellow-100 text-yellow-800 border-yellow-200",
  EXPERT: "bg-red-100 text-red-800 border-red-200",
}

export default function SectionsTable({
  sections,
}: {
  sections: GeneralActionResponse<{
    rows: Section[]
    count: number
    numberOfPages: number
  }>
}) {
  const query = useSearchParams()
  const sort = query.get("sort") || "createdAt"
  const order = query.get("order") || "asc"
  const page = query.get("page") || "1"
  const pageSize = query.get("limit") || "10"
  const router = useRouter()

  if (sections.error) {
    return (
      <div className="bg-admin-surface border border-admin-border rounded-lg p-6">
        <div className="text-center text-red-500">
          Error loading sections: {sections.error}
        </div>
      </div>
    )
  }

  if (!sections.data || sections.data.rows.length === 0) {
    return (
      <div className="bg-admin-surface border border-admin-border rounded-lg">
        <SectionsFilter />
        <div className="p-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-admin-textMuted opacity-50" />
          <h3 className="text-lg font-medium text-admin-text mb-2">
            No sections found
          </h3>
          <p className="text-admin-textMuted">
            This module doesn't have any sections yet. Sections will appear here
            once they're created.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="">
      <SectionsFilter />

      <Table
        onRowClick={(row) => {
          router.push(`/admin/modules/${row.moduleId}/sections/${row.id}`)
        }}  
        headers={[
          {
            label: "ID",
            key: "id",
            componentKey: "id",
            sortable: true,
            cell: (value: number) => (
              <div className="font-mono text-sm text-admin-textMuted">
                #{value}
              </div>
            ),
            sorted: sort === "id",
            order: order === "asc" ? "desc" : "asc",
          },
          {
            label: "Section",
            key: "name",
            componentKey: "name",
            sortable: true,
            cell: (value: string, row: any) => (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-admin-surface border border-admin-border flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-admin-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-admin-text truncate">
                    {value}
                  </div>
                  {row.description && (
                    <div className="text-sm text-admin-textMuted mt-1 line-clamp-2">
                      {row.description}
                    </div>
                  )}
                </div>
              </div>
            ),
            sorted: sort === "name",
            order: order === "asc" ? "desc" : "asc",
          },
          {
            label: "Level",
            key: "level",
            componentKey: "level",
            sortable: false,
            cell: (value: any) => {
              if (!value) {
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-100 text-gray-600 border-gray-200">
                    Not set
                  </span>
                )
              }
              return (
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      levelColors[value as keyof typeof levelColors]
                    }`}
                  >
                    {value.charAt(0) + value.slice(1).toLowerCase()}
                  </span>
                </div>
              )
            },
            sorted: sort === "level",
            order: order === "asc" ? "desc" : "asc",
          },
          {
            label: "Created",
            key: "createdAt",
            componentKey: "createdAt",
            sortable: true,
            cell: (value: string | null) => (
              <div className="flex items-center gap-2 text-sm text-admin-textMuted">
                <Calendar className="w-4 h-4" />
                <span>
                  {value ? new Date(value).toLocaleDateString() : "N/A"}
                </span>
              </div>
            ),
            sorted: sort === "createdAt",
            order: order === "asc" ? "desc" : "asc",
          },
          {
            label: "Last Updated",
            key: "updatedAt",
            componentKey: "updatedAt",
            sortable: true,
            cell: (value: string | null) => (
              <div className="flex items-center gap-2 text-sm text-admin-textMuted">
                <Clock className="w-4 h-4" />
                <span>
                  {value ? new Date(value).toLocaleDateString() : "Not updated"}
                </span>
              </div>
            ),
            sorted: sort === "updatedAt",
            order: order === "asc" ? "desc" : "asc",
          },
        ]}
        data={sections.data.rows}
        onSort={(column) => {
          const newOrder = order === "asc" ? "desc" : "asc"
          const newQuery = new URLSearchParams(query)
          newQuery.set("sort", column)
          newQuery.set("order", newOrder)
          router.push(`?${newQuery.toString()}`)
        }}
      />

      {sections.data.numberOfPages > 1 && (
        <div className="px-4 py-3 border-t border-admin-border">
          <Pagination
            rowsCount={sections.data.count}
            currentPage={Number(page)}
            maxPage={sections.data.numberOfPages}
            onChange={(newPage) => {
              const newQuery = new URLSearchParams(query)
              newQuery.set("page", newPage.toString())
              router.push(`?${newQuery.toString()}`)
            }}
            pageSize={Number(pageSize)}
            onSizeChange={(size) => {
              const newQuery = new URLSearchParams(query)
              newQuery.set("limit", size.toString())
              router.push(`?${newQuery.toString()}`)
            }}
          />
        </div>
      )}
    </div>
  )
}

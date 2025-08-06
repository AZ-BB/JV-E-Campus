'use client'

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ModulesFilter from "./modules-filter"
import ModulesTables from "./modules-tables"
import ModulesGrid from "./modules-grid"
import Pagination from "@/components/pagination"
import { GeneralActionResponse } from "@/types/general-action-response"
import { modules } from '@/db/schema/schema'

export default function ModulesViewWrapper({
    initialView,
    modulesData,
    showRoleFilter = true
}: {
    initialView: 'table' | 'grid'
    modulesData: GeneralActionResponse<{ rows: (typeof modules.$inferSelect & { createdByFullName: string | null })[], count: number, numberOfPages: number }>
    showRoleFilter?: boolean
}) {
    const [view, setView] = useState<'table' | 'grid'>(initialView)
    const router = useRouter()
    const searchParams = useSearchParams()

    const page = searchParams.get("page") || "1"
    const pageSize = searchParams.get("limit") || "10"

    const handleViewChange = (newView: 'table' | 'grid') => {
        setView(newView)

        // Update URL with new view parameter
        const params = new URLSearchParams(searchParams)
        params.set("view", newView)
        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="pb-4">
            <ModulesFilter
                view={view}
                onViewChange={handleViewChange}
                showRoleFilter={showRoleFilter}
            />

            {view === 'table' ? (
                <ModulesTables data={modulesData} />
            ) : (
                <div>
                    <ModulesGrid data={modulesData} />

                    {/* Pagination for Grid View */}
                    <div className="px-4">
                        <Pagination
                            rowsCount={modulesData.data?.count || 0}
                            currentPage={Number(page)}
                            pageSize={Number(pageSize)}
                            maxPage={modulesData.data?.numberOfPages || 1}
                            onChange={(page) => {
                                const newQuery = new URLSearchParams(searchParams)
                                newQuery.set("page", page.toString())
                                router.push(`?${newQuery.toString()}`, { scroll: false })
                            }}
                            onSizeChange={(size) => {
                                const newQuery = new URLSearchParams(searchParams)
                                newQuery.set("limit", size.toString())
                                router.push(`?${newQuery.toString()}`, { scroll: false })
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
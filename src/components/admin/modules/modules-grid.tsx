'use client'

import { GeneralActionResponse } from "@/types/general-action-response"
import { modules } from '@/db/schema/schema'

type ModuleWithCreator = typeof modules.$inferSelect & {
    createdByFullName: string | null
}
import Avatar from "@/components/ui/avatar"
import Button from "@/components/ui/button"
import { mapAvatarImageUrl, mapIconUrl } from "@/utils/utils"
import { Pencil, Trash, MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"

export default function ModulesGrid({
    data,
}: {
    data: GeneralActionResponse<{ rows: typeof modules.$inferSelect[], count: number, numberOfPages: number }>
}) {
    const router = useRouter()
    const [openMenuId, setOpenMenuId] = useState<number | null>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null)
            }
        }

        if (openMenuId !== null) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }
    }, [openMenuId])

    const handleCardClick = (moduleId: number) => {
        router.push(`/admin/modules/${moduleId}`)
    }

    const handleMenuToggle = (e: React.MouseEvent, moduleId: number) => {
        e.stopPropagation()
        setOpenMenuId(openMenuId === moduleId ? null : moduleId)
    }

    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-4">
            {
                data.data?.rows.length === 0 && (
                    <div className="flex justify-center items-center h-full col-span-full">
                        <p className="text-admin-textMuted">No modules found</p>
                    </div>
                )
            }
            {data.data?.rows.map((module) => {
                const moduleWithCreator = module as ModuleWithCreator
                return (
                    <div
                        key={moduleWithCreator.id}
                        className="relative bg-admin-surface border border-admin-border rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-admin-primary/30 group"
                        onClick={() => handleCardClick(moduleWithCreator.id)}
                    >
                        {/* Actions Menu */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="relative" ref={menuRef}>
                                <Button
                                    className="w-8 h-8 flex justify-center items-center bg-admin-surface hover:bg-admin-primary/50 border border-admin-border rounded-full text-admin-textMuted hover:text-admin-primary"
                                    onClick={(e) => handleMenuToggle(e, moduleWithCreator.id)}
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </Button>

                                {/* Dropdown Menu */}
                                {openMenuId === moduleWithCreator.id && (
                                    <div className="absolute top-full right-0 mt-1 bg-admin-surface border border-admin-border rounded-lg shadow-lg z-10 min-w-[120px]">
                                        <div className="p-1">
                                            <Button
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-transparent hover:bg-admin-primary/50 text-admin-text justify-start rounded-md"
                                                onClick={handleActionClick}
                                            >
                                                <Pencil className="w-4 h-4" />
                                                Edit
                                            </Button>
                                            <Button
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-transparent hover:bg-admin-accent/10 text-admin-accent justify-start rounded-md"
                                                onClick={handleActionClick}
                                            >
                                                <Trash className="w-4 h-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Module Icon */}
                        <div className="flex justify-center mb-4 min-h-16 min-w-16">
                            <Avatar
                                src={mapIconUrl(moduleWithCreator.iconUrl || "")}
                                alt={`${moduleWithCreator.name} icon`}
                                className="w-16 h-16"
                                fallback={moduleWithCreator.name.split(" ").slice(0, 2).map((name: string) => name[0]).join("") || "M"}
                            />
                        </div>

                        {/* Module Info */}
                        <div className="text-center space-y-2">
                            <h3 className="font-semibold text-admin-text text-sm line-clamp-1" title={moduleWithCreator.name}>
                                {moduleWithCreator.name}
                            </h3>

                            {moduleWithCreator.slogan && (
                                <p className="text-xs text-admin-textMuted line-clamp-1" title={moduleWithCreator.slogan}>
                                    {moduleWithCreator.slogan}
                                </p>
                            )}

                            {moduleWithCreator.description && (
                                <p className="text-xs text-admin-textMuted line-clamp-2" title={moduleWithCreator.description}>
                                    {moduleWithCreator.description}
                                </p>
                            )}
                        </div>

                        {/* Module Meta */}
                        <div className="mt-4 pt-3 border-t border-admin-border">
                            <div className="flex justify-between items-center text-xs text-admin-textMuted">
                                <span title={`Created: ${moduleWithCreator.createdAt || 'Unknown'}`}>
                                    {moduleWithCreator.createdAt ? moduleWithCreator.createdAt.split(" ")[0] : 'N/A'}
                                </span>
                                <span title={`By: ${moduleWithCreator.createdByFullName || 'Unknown'}`} className="line-clamp-1 max-w-[80px]">
                                    {moduleWithCreator.createdByFullName || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
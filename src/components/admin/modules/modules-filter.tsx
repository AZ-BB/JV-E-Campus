'use client'

import { useEffect, useState } from "react"
import Input from "../../ui/input"
import { useRouter } from "next/navigation"
import debounce from "lodash.debounce"
import { MultipleSelect } from "@/components/ui/multiple-select"
import { getRolesNames } from "@/actions/roles"
import Button from "@/components/ui/button"
import { TableIcon, Grid3X3, LayoutGrid } from "lucide-react"

export default function ModulesFilter({
    view,
    onViewChange,
    showRoleFilter = false
}: {
    view: 'table' | 'grid'
    onViewChange: (view: 'table' | 'grid') => void
    showRoleFilter?: boolean
}) {

    const router = useRouter()
    const [search, setSearch] = useState("")

    const [roles, setRoles] = useState<{ label: string, value: string }[]>([])
    const [roleIds, setRoleIds] = useState<string[]>([])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const search = params.get("search")
        if (search) {
            setSearch(search)
        }

        getRolesNames().then((res) => {
            if (res.data) {
                setRoles(res.data.map((role) => ({ label: role.name, value: role.id.toString() })))
            }
        })
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)

        const debouncedSearch = debounce(() => {
            params.set("search", search)
            router.push(`?${params.toString()}`)
        }, 500)

        debouncedSearch()

        return () => {
            debouncedSearch.cancel()
        }
    }, [search])

    function handleSelectRoleIds(value: string[]) {
        setRoleIds(value)
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        params.set("roleIds", roleIds.join(","))
        router.push(`?${params.toString()}`)
    }, [roleIds])

    return (
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 py-4 lg:py-3">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">

                <Input
                    labelClassName="text-xs"
                    label="Search"
                    placeholder="Search"
                    className="w-80 bg-admin-surface border-admin-border h-10 text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} />

                {showRoleFilter && (
                    <MultipleSelect
                        className="w-44 h-10"
                        options={roles}
                        value={roleIds}
                        onValueChange={handleSelectRoleIds}
                        labelClassName="text-xs"
                        label="Role"
                        placeholder="Select Role.."
                    />
                )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-admin-surface border border-admin-border rounded-lg p-1 translate-y-2">
                <Button
                    className={`w-10 h-8 flex justify-center items-center rounded-md transition-colors ${view === 'table'
                        ? 'bg-admin-primary text-white'
                        : 'bg-transparent text-admin-textMuted hover:bg-admin-primary/50'
                        }`}
                    onClick={() => onViewChange('table')}
                    title="Table View"
                >
                    <TableIcon className="w-4 h-4" />
                </Button>
                <Button
                    className={`w-10 h-8 flex justify-center items-center rounded-md transition-colors ${view === 'grid'
                        ? 'bg-admin-primary text-white'
                        : 'bg-transparent text-admin-textMuted hover:bg-admin-primary/50'
                        }`}
                    onClick={() => onViewChange('grid')}
                    title="Grid View"
                >
                    <LayoutGrid className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
import { useEffect, useState } from "react"
import Input from "./ui/input"
import { useRouter } from "next/navigation"
import debounce from "lodash.debounce"
import { MultipleSelect } from "./ui/multiple-select"
import { getRolesDropList } from "@/actions/roles"
import { getBranchesDropList } from "@/actions/branches"
import { getAdminDropList } from "@/actions/users"

export default function Filter({
    children
}: {
    children: React.ReactNode
}) {

    const router = useRouter()
    const [search, setSearch] = useState("")

    const [roles, setRoles] = useState<{ label: string, value: number }[]>([])
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])

    const [branches, setBranches] = useState<{ label: string, value: number }[]>([])
    const [selectedBranches, setSelectedBranches] = useState<string[]>([])

    const [createdBy, setCreatedBy] = useState<{ label: string, value: number }[]>([])
    const [selectedCreatedBy, setSelectedCreatedBy] = useState<string[]>([])

    useEffect(() => {

        const params = new URLSearchParams(window.location.search)
        const roles = params.get("roles")
        if (roles) {
            setSelectedRoles(roles.split(","))
        }

        const createdBy = params.get("createdBy")
        if (createdBy) {
            setSelectedCreatedBy(createdBy.split(","))
        }

        const branchId = params.get("branchIds")
        if (branchId) {
            setSelectedBranches(branchId.split(","))
        }

        getRolesDropList().then((res) => {
            if (res.data) {
                setRoles(res.data)
            }
        })

        getBranchesDropList().then((res) => {
            if (res.data) {
                setBranches(res.data)
            }
        })

        getAdminDropList().then((res) => {
            if (res.data) {
                setCreatedBy(res.data)
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

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        params.set("roles", selectedRoles.join(","))
        router.push(`?${params.toString()}`)
    }, [selectedRoles])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        params.set("createdBy", selectedCreatedBy.join(","))
        router.push(`?${params.toString()}`)
    }, [selectedCreatedBy])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        params.set("branchIds", selectedBranches.join(","))
        router.push(`?${params.toString()}`)
    }, [selectedBranches])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        params.set("createdByIds", selectedCreatedBy.join(","))
        router.push(`?${params.toString()}`)
    }, [selectedCreatedBy])

    return (
        <div className="flex justify-between items-center gap-4 py-4">
            <div>
                {children}
            </div>

            <div className="flex justify-between items-center gap-4">

                <MultipleSelect
                    className="w-44 h-10"
                    options={createdBy.map((admin) => ({ label: admin.label, value: admin.value.toString() }))}
                    value={selectedCreatedBy}
                    onValueChange={(value) => {
                        setSelectedCreatedBy(value)
                    }}
                    labelClassName="text-xs"
                    label="Created By"
                    placeholder="Select Admin.."
                />

                <MultipleSelect
                    className="w-44 h-10"
                    options={roles.map((role) => ({ label: role.label, value: role.value.toString() }))}
                    value={selectedRoles}
                    onValueChange={(value) => {
                        setSelectedRoles(value)
                    }}
                    labelClassName="text-xs"
                    label="Staff Role"
                    placeholder="Select Staff Role.."
                />

                <MultipleSelect
                    className="w-44 h-10"
                    options={branches.map((branch) => ({ label: branch.label, value: branch.value.toString() }))}
                    value={selectedBranches}
                    onValueChange={(value) => {
                        setSelectedBranches(value)
                    }}
                    labelClassName="text-xs"
                    label="Branch"
                    placeholder="Select Branch.."
                />

                <Input
                    labelClassName="text-xs"
                    label="Search"
                    placeholder="Search"
                    className="w-80 bg-admin-surface border-admin-border h-10 text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} />
            </div>
        </div>
    )
}
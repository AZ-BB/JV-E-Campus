import { useEffect, useState } from "react"
import Input from "../../ui/input"
import { useRouter } from "next/navigation"
import debounce from "lodash.debounce"
import { MultipleSelect } from "../../ui/multiple-select"
import { getRolesNames } from "@/actions/roles"
import { getBranchesNames } from "@/actions/branches"
import { getAdminsNames } from "@/actions/users"

export default function StaffFilter({
    children
}: {
    children: React.ReactNode
}) {

    const router = useRouter()
    const [search, setSearch] = useState("")

    const [roles, setRoles] = useState<{ label: string, value: string }[]>([])
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])

    const [branches, setBranches] = useState<{ label: string, value: string }[]>([])
    const [selectedBranches, setSelectedBranches] = useState<string[]>([])

    const [createdBy, setCreatedBy] = useState<{ label: string, value: string }[]>([])
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

        getRolesNames().then((res) => {
            if (res.data) {
                setRoles(res.data.map((role) => ({ label: role.name, value: role.id.toString() })))
            }
        })

        getBranchesNames().then((res) => {
            if (res.data) {
                setBranches(res.data.map((branch) => ({ label: branch.name, value: branch.id.toString() })))
            }
        })

        getAdminsNames().then((res) => {
            if (res.data) {
                setCreatedBy(res.data.map((admin) => ({ label: admin.fullName, value: admin.id.toString() })))
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
            <div className="mt-5">
                {children}
            </div>

            <div className="flex justify-between items-center gap-4">

                <MultipleSelect
                    className="w-44 h-10"
                    options={createdBy.map((admin) => ({ label: admin.label, value: admin.value }))}
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
                    options={roles.map((role) => ({ label: role.label, value: role.value }))}
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
                    options={branches.map((branch) => ({ label: branch.label, value: branch.value }))}
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
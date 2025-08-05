import { useEffect, useState } from "react"
import Input from "../../ui/input"
import { useRouter } from "next/navigation"
import debounce from "lodash.debounce"
import { MultipleSelect } from "../../ui/multiple-select"
import { getRolesNames } from "@/actions/roles"
import { getBranchesNames } from "@/actions/branches"
import { getAdminsNames } from "@/actions/admins"

export default function StaffFilter({
    children
}: {
    children: React.ReactNode
}) {

    const [initialLoad, setInitialLoad] = useState(false)

    const router = useRouter()
    const [search, setSearch] = useState("")

    const [roles, setRoles] = useState<{ label: string, value: string }[]>([])
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])

    const [branches, setBranches] = useState<{ label: string, value: string }[]>([])
    const [selectedBranches, setSelectedBranches] = useState<string[]>([])

    const [createdBy, setCreatedBy] = useState<{ label: string, value: string }[]>([])
    const [selectedCreatedBy, setSelectedCreatedBy] = useState<string[]>([])

    useEffect(() => {
        async function fetchData() {
            const roles = await getRolesNames()
            if (roles.data) {
                setRoles(roles.data.map((role) => ({ label: role.name, value: role.id.toString() })))
            }

            const branches = await getBranchesNames()
            if (branches.data) {
                setBranches(branches.data.map((branch) => ({ label: branch.name, value: branch.id.toString() })))
            }

            const createdBy = await getAdminsNames()
            if (createdBy.data) {
                setCreatedBy(createdBy.data.map((admin) => ({ label: admin.fullName, value: admin.id.toString() })))
            }

            setInitialLoad(true)
        }

        fetchData()

    }, [])

    function handleSelectCreatedBy(value: string[]) {
        const params = new URLSearchParams(window.location.search)
        params.set("createdByIds", value.join(","))
        router.push(`?${params.toString()}`)
    }

    function handleSelectRoles(value: string[]) {
        const params = new URLSearchParams(window.location.search)
        params.set("roles", value.join(","))
        router.push(`?${params.toString()}`)
    }

    function handleSelectBranches(value: string[]) {
        const params = new URLSearchParams(window.location.search)
        params.set("branchIds", value.join(","))
        router.push(`?${params.toString()}`)
    }

    useEffect(() => {
        if (!initialLoad) return
        
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
                    onValueChange={handleSelectCreatedBy}
                    labelClassName="text-xs"
                    label="Created By"
                    placeholder="Select Admin.."
                />

                <MultipleSelect
                    className="w-44 h-10"
                    options={roles.map((role) => ({ label: role.label, value: role.value }))}
                    value={selectedRoles}
                    onValueChange={handleSelectRoles}
                    labelClassName="text-xs"
                    label="Staff Role"
                    placeholder="Select Staff Role.."
                />

                <MultipleSelect
                    className="w-44 h-10"
                    options={branches.map((branch) => ({ label: branch.label, value: branch.value }))}
                    value={selectedBranches}
                    onValueChange={handleSelectBranches}
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
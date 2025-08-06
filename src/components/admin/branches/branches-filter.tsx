import { useEffect, useState } from "react"
import Input from "../../ui/input"
import { useRouter } from "next/navigation"
import debounce from "lodash.debounce"

export default function BranchesFilter() {

    const router = useRouter()
    const [search, setSearch] = useState("")

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)

        if (params.get("search")) {
            setSearch(params.get("search") || "")
        }
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

    return (
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 py-4">
            <div className="flex lg:justify-end items-center gap-4 w-full lg:w-auto">
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
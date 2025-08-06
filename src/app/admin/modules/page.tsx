import { getModules } from "@/actions/modules"
import ModulesViewWrapper from "@/components/admin/modules/modules-view-wrapper"

export default async function ModulesPage({
    searchParams
}: {
    searchParams: Promise<{
        page: string
        limit: string
        search: string
        sort: string
        order: string
        roleIds: string
        view: string
    }>
}) {

    const {
        page = '1',
        limit = '10',
        search = '',
        sort = 'id',
        order = 'asc',
        roleIds = '',
        view = 'table'
    } = await searchParams

    const modules = await getModules({
        page: Number(page || '1'),
        limit: Number(limit || '10'),
        search: search || '',
        orderBy: sort as any,
        orderDirection: order as "asc" | "desc",
        filters: {
            roleIds: roleIds ? roleIds.split(',').map(Number) : []
        }
    })

    return (
        <div className="p-2">
            <div className="pb-4">
                <h1 className="text-2xl font-bold text-admin-text mb-1">Module Management</h1>
                <p className="text-admin-text-muted text-sm">Overview of your modules</p>
            </div>

            <ModulesViewWrapper 
                initialView={view as 'table' | 'grid'}
                modulesData={modules as any}
            />
        </div>
    )
}
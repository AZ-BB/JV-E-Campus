import { getModules } from "@/actions/modules"
import ModulesViewWrapper from "@/components/admin/modules/modules-view-wrapper"

export default async function CareerPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{
        page: string
        limit: string
        search: string
        sort: string
        order: string
        view: string
    }>
}) {

    const { id } = await params
    const {
        page = '1',
        limit = '10',
        search = '',
        sort = 'id',
        order = 'asc',
        view = 'grid'
    } = await searchParams

    const modulesData = await getModules({
        page: Number(page || '1'),
        limit: Number(limit || '10'),
        search: search || '',
        orderBy: sort as any,
        orderDirection: order as "asc" | "desc",
        filters: {
            roleIds: [Number(id)]
        }
    })

    return (
        <div className="p-2">
            <div className="pb-4">
                <h1 className="text-2xl font-bold text-admin-text mb-1">Career Management</h1>
                <p className="text-admin-text-muted text-sm">Overview of your careers</p>
            </div>

            <ModulesViewWrapper
                initialView={view as 'table' | 'grid'}
                modulesData={modulesData}
            />
        </div>
    )
}
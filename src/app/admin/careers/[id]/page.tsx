import { getModules } from "@/actions/modules"
import { getRole } from "@/actions/roles"
import ModulesViewWrapper from "@/components/admin/modules/modules-view-wrapper"
import Breadcrumb from "@/components/ui/breadcrumb"
import Button from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"

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

    const roleData = await getRole(Number(id))

    const breadcrumbItems = [
        { label: "Careers", href: "/admin/careers" },
        { label: roleData.data?.name || "Role" }
    ];

    return (
        <div className="p-2">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            {/* Back Button */}
            <div className="flex justify-between items-center">
                <Link
                    href="/admin/careers"
                    className="inline-flex items-center gap-2 text-admin-textMuted hover:text-admin-primary transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Careers List
                </Link>


                <div>
                    <Button className="flex items-center gap-1 bg-admin-primary p-2 text-admin-primary-foreground hover:bg-admin-primary/80">
                        <Plus className="w-4 h-4" />
                        Add Module
                    </Button>
                </div>
            </div>

            <ModulesViewWrapper
                initialView={view as 'table' | 'grid'}
                modulesData={modulesData}
                showRoleFilter={false}
            />
        </div>
    )
}
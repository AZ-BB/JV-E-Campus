import { getModule } from "@/actions/modules"
import Breadcrumb from "@/components/ui/breadcrumb";
import Avatar from "@/components/ui/avatar";
import {
    Calendar,
    User,
    Shield,
    ArrowLeft,
    Book,
    Users,
    FileText
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mapAvatarImageUrl } from "@/utils/utils";
import { getSections } from "@/actions/sections";
import SectionsTable from "@/components/admin/modules/sections/sections-table";

export default async function ModulePage({
    params,
    searchParams
}: {
    params: Promise<{
        id: string
    }>
    searchParams: Promise<{
        page?: string
        limit?: string
        search?: string
        sort?: string
        order?: string
    }>
}) {
    const { id } = await params

    const moduleResponse = await getModule(Number(id))
    if (moduleResponse.error || !moduleResponse.data) {
        return <div className="p-6 text-red-500">Error: {moduleResponse.error || "Module not found"}</div>
    }

    const moduleData = moduleResponse.data;

    const breadcrumbItems = [
        { label: "Modules", href: "/admin/modules" },
        { label: moduleData.name }
    ];

    const searchParamsData = await searchParams
    const sectionsResponse = await getSections(Number(id), {
        page: Number(searchParamsData.page) || 1,
        limit: Number(searchParamsData.limit) || 10,
        search: searchParamsData.search || "",
        sort: searchParamsData.sort as any || "createdAt",
        order: searchParamsData.order as "asc" | "desc" || "desc"
    })
    if (sectionsResponse.error || !sectionsResponse.data) {
        return <div className="p-6 text-red-500">Error: {sectionsResponse.error || "Sections not found"}</div>
    }

    return (
        <div className="p-4 sm:p-6 pt-4">
            <Breadcrumb items={breadcrumbItems} className="mb-4 sm:mb-6" />

            {/* Back Button */}
            <Link
                href="/admin/modules"
                className="inline-flex items-center gap-2 text-admin-textMuted hover:text-admin-primary transition-colors mb-4 sm:mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Modules List</span>
                <span className="sm:hidden">Back</span>
            </Link>

            {/* Module Preview Section - Compact for TOC */}
            <div className="bg-admin-surface border border-admin-border rounded-lg shadow-sm mb-6 sm:mb-8">
                <div className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6">
                        {/* Module Icon */}
                        <div className="flex-shrink-0 self-center lg:self-start">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-admin-surface border border-admin-border flex items-center justify-center">
                                {moduleData.iconUrl ? (
                                    <Avatar
                                        src={mapAvatarImageUrl(moduleData.iconUrl) || ""}
                                        alt={moduleData.name}
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg"
                                        fallback={moduleData.name.split(" ").slice(0, 2).map((name: string) => name[0]).join("") || "M"}
                                    />
                                ) : (
                                    <Book className="w-8 h-8 sm:w-10 sm:h-10 text-admin-primary" />
                                )}
                            </div>
                        </div>

                        {/* Module Info */}
                        <div className="flex-grow text-center lg:text-left">
                            <div className="mb-4">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-admin-text mb-2">{moduleData.name}</h1>
                                {moduleData.slogan && (
                                    <p className="text-admin-textMuted text-sm italic mb-2">"{moduleData.slogan}"</p>
                                )}
                                {moduleData.description && (
                                    <p className="text-admin-textMuted text-sm leading-relaxed">{moduleData.description}</p>
                                )}
                            </div>

                            {/* Quick Stats Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
                                <div className="flex items-center justify-center lg:justify-start gap-2 text-admin-textMuted">
                                    <Calendar className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">Created {moduleData.createdAt ? new Date(moduleData.createdAt).toLocaleDateString() : "Unknown"}</span>
                                </div>
                                <div className="flex items-center justify-center lg:justify-start gap-2 text-admin-textMuted">
                                    <User className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">By {moduleData.createdByFullName || "Unknown"}</span>
                                </div>
                                <div className="flex items-center justify-center lg:justify-start gap-2 text-admin-textMuted">
                                    <Shield className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{moduleData.roles.length} role{moduleData.roles.length !== 1 ? 's' : ''} assigned</span>
                                </div>
                            </div>

                            {/* Roles Tags */}
                            {moduleData.roles.length > 0 && (
                                <div className="mt-4">
                                    <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                        {moduleData.roles.map((role) => (
                                            <span
                                                key={role.roleId}
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-admin-surface text-admin-text border border-admin-border"
                                            >
                                                {role.roleName}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Module Stats */}
                        <div className="flex-shrink-0 w-full lg:w-auto">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center max-w-xs mx-auto lg:max-w-none">
                                <div className="bg-admin-surface p-3 sm:p-4 rounded-lg border border-admin-border hover:bg-admin-border transition-all duration-200">
                                    <FileText className="w-5 h-5 mx-auto mb-1 text-admin-primary" />
                                    <div className="text-xs text-admin-textMuted">Sections</div>
                                    <div className="text-lg sm:text-xl font-semibold text-admin-text">{sectionsResponse.data.count}</div>
                                </div>
                                <div className="bg-admin-surface p-3 sm:p-4 rounded-lg border border-admin-border hover:bg-admin-border transition-all duration-200">
                                    <Users className="w-5 h-5 mx-auto mb-1 text-admin-primary" />
                                    <div className="text-xs text-admin-textMuted">Enrollments</div>
                                    <div className="text-lg sm:text-xl font-semibold text-admin-text">0</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sections Table */}
            <div className="mb-6 sm:mb-8">
                <div className="mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-admin-text mb-2">Module Sections</h2>
                    <p className="text-sm text-admin-textMuted">
                        Browse and manage the sections that make up this module.
                    </p>
                </div>
                <SectionsTable sections={sectionsResponse} />
            </div>
        </div>
    )
}
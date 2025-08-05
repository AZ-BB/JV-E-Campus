import { getRolesNames } from "@/actions/roles"
import RoleCard from "@/components/admin/careers/role-card"

export default async function CareersPage() {
    const { data: roles, error } = await getRolesNames()

    if (error) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-admin-text mb-2">Error Loading Roles</h1>
                    <p className="text-admin-text-muted">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col p-4">
            {/* Header Section */}
            <div className="flex-shrink-0 mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-admin-text">
                    Careers
                </h1>
                <p className="text-admin-text-muted text-sm lg:text-base">
                    Explore different roles and their training modules in our campus system
                </p>
            </div>

            {/* Roles Grid */}
            <div className="flex-1">
                {roles && roles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {roles.map((role) => (
                            <RoleCard key={role.id} role={role} />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-admin-text mb-2">No Roles Available</h2>
                            <p className="text-admin-text-muted">Contact your administrator to set up career roles.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
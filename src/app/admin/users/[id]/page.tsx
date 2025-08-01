import Breadcrumb from "@/components/ui/breadcrumb";
import Avatar from "@/components/ui/avatar";
import {
    Mail,
    Phone,
    Globe,
    MapPin,
    Calendar,
    User,
    Building2,
    Shield,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { getAdminUserById } from "@/actions/admins";
import { notFound } from "next/navigation";
import { mapAvatarImageUrl } from "@/utils/utils";
import UserActions from "@/components/admin/users/[id]/admins-actions";

import LogsSection from "@/components/logs/logs-section";
import LogsSkeleton from "@/components/logs/logs-skeleton";
import { Suspense } from "react";

export default async function AdminPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Await params and searchParams
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    // Extract search parameters
    const page = parseInt((resolvedSearchParams.page as string) || "1");
    const limit = parseInt((resolvedSearchParams.limit as string) || "10");
    const search = (resolvedSearchParams.search as string) || "";
    const logType = (resolvedSearchParams.logType as string) || "";
    const actedOnType = (resolvedSearchParams.actedOnType as string) || "";

    // Fetch staff data
    const adminResponse = await getAdminUserById(parseInt(resolvedParams.id));

    if (adminResponse.error || !adminResponse.data) {
        notFound();
    }

        const adminData = adminResponse.data;

    const breadcrumbItems = [
        { label: "Admins", href: "/admin/users" },
        { label: adminData.fullName }
    ];

    return (
        <div className="p-6 pt-4">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            {/* Back Button */}
            <Link
                href="/admin/users"
                className="inline-flex items-center gap-2 text-admin-textMuted hover:text-admin-primary transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Users List
            </Link>

            {/* Header Section */}
            <div className="bg-admin-surface border border-admin-border rounded-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                        <Avatar
                            className="w-32 h-32"
                            src={mapAvatarImageUrl(adminData.profilePictureUrl || "")}
                            alt={adminData.fullName}
                            fallback={adminData.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                        />
                    </div>

                    {/* Basic Info */}
                    <div className="flex-grow">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-admin-text mb-2">{adminData.fullName}</h1>
                            </div>

                            {/* Action Buttons */}
                            <UserActions userData={adminData} />
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1 text-admin-textMuted">
                                <Calendar className="w-4 h-4" />
                                <span>Joined {adminData.createdAt ? new Date(adminData.createdAt).toLocaleDateString() : "Unknown"}</span>
                            </div>
                            <div className="flex items-center gap-1 text-admin-textMuted">
                                <User className="w-4 h-4" />
                                <span>Created by {adminData.createdByFullName || "Unknown"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Contact Information */}
                <div className="bg-admin-surface border border-admin-border rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-admin-text mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Contact Information
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-admin-textMuted" />
                            <span className="text-admin-text">{adminData.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4 text-admin-textMuted" />
                            <span className="text-admin-text capitalize">{adminData.role.toLowerCase()} Role</span>
                        </div>
                        {adminData.createdBy && (
                            <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-admin-textMuted" />
                                <span className="text-admin-text">Created by: {adminData.createdByFullName}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Account Information */}
                <div className="bg-admin-surface border border-admin-border rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-admin-text mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Account Information
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-admin-textMuted" />
                            <div>
                                <span className="text-admin-textMuted text-sm">Created Date</span>
                                <p className="text-admin-text">{adminData.createdAt ? new Date(adminData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Unknown"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-admin-textMuted" />
                            <div>
                                <span className="text-admin-textMuted text-sm">Total Users Created</span>
                                <p className="text-admin-text">{adminData.created_users_count || 0}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4 text-admin-textMuted" />
                            <div>
                                <span className="text-admin-textMuted text-sm">Account Status</span>
                                <p className="text-green-600">Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Logs with Suspense */}
            <Suspense fallback={<LogsSkeleton showActor={false} title="Activity Logs" rowCount={5} />}>
                <LogsSection 
                    actorId={adminData.id}
                    title="Activity Logs"
                    icon={<Calendar className="w-5 h-5" />}
                    searchParams={resolvedSearchParams}
                    searchPlaceholder="Search admin logs..."
                />
            </Suspense>

        </div>
    )
}
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

export default async function StaffPage({ params }: { params: { id: string } }) {
    // Fetch staff data
    const adminResponse = await getAdminUserById(parseInt(params.id));

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

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-admin-surface border border-admin-border rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-admin-text mb-4 flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Contact Information
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-admin-textMuted flex-shrink-0" />
                            <div>
                                <p className="text-sm text-admin-textMuted">Email</p>
                                <p className="text-admin-text font-medium">{adminData.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}
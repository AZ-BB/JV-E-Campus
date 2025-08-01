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
import { getStaffUserById } from "@/actions/staff";
import { notFound } from "next/navigation";
import StaffActions from "@/components/admin/staff/[id]/staff-actions";
import { mapAvatarImageUrl } from "@/utils/utils";

export default async function StaffPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    // Fetch staff data
    const staffResponse = await getStaffUserById(parseInt((await params).id));

    if (staffResponse.error || !staffResponse.data) {
        notFound();
    }

    const staffData = staffResponse.data;

    const breadcrumbItems = [
        { label: "Staff", href: "/admin/staff" },
        { label: staffData.fullName }
    ];

    return (
        <div className="p-6 pt-4">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            {/* Back Button */}
            <Link
                href="/admin/staff"
                className="inline-flex items-center gap-2 text-admin-textMuted hover:text-admin-primary transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Staff List
            </Link>

            {/* Header Section */}
            <div className="bg-admin-surface border border-admin-border rounded-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                        <Avatar
                            className="w-32 h-32"
                            src={mapAvatarImageUrl(staffData.profilePictureUrl || "")}
                            alt={staffData.fullName}
                            fallback={staffData.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                        />
                    </div>

                    {/* Basic Info */}
                    <div className="flex-grow">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-admin-text mb-2">{staffData.fullName}</h1>
                                <div className="flex items-center gap-2 text-admin-textMuted mb-2">
                                    <Shield className="w-4 h-4" />
                                    <span>{staffData.staffRoleName || "No role assigned"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-admin-textMuted">
                                    <Building2 className="w-4 h-4" />
                                    <span>{staffData.branchName}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <StaffActions staffData={staffData} />
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1 text-admin-textMuted">
                                <Calendar className="w-4 h-4" />
                                <span>Joined {staffData.createdAt ? new Date(staffData.createdAt).toLocaleDateString() : "Unknown"}</span>
                            </div>
                            <div className="flex items-center gap-1 text-admin-textMuted">
                                <User className="w-4 h-4" />
                                <span>Created by {staffData.createdByName || "Unknown"}</span>
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
                                <p className="text-admin-text font-medium">{staffData.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-admin-textMuted flex-shrink-0" />
                            <div>
                                <p className="text-sm text-admin-textMuted">Phone</p>
                                <p className="text-admin-text font-medium">{staffData.phoneNumber || "Not provided"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-admin-textMuted flex-shrink-0" />
                            <div>
                                <p className="text-sm text-admin-textMuted">Language</p>
                                <p className="text-admin-text font-medium">{staffData.language}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Employment Details */}
                <div className="bg-admin-surface border border-admin-border rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-admin-text mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Employment Details
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4 text-admin-textMuted flex-shrink-0" />
                            <div>
                                <p className="text-sm text-admin-textMuted">Role</p>
                                <p className="text-admin-text font-medium">{staffData.staffRoleName + " - " + staffData.staffRoleFullName || "No role assigned"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Building2 className="w-4 h-4 text-admin-textMuted flex-shrink-0" />
                            <div>
                                <p className="text-sm text-admin-textMuted">Branch</p>
                                <p className="text-admin-text font-medium">{staffData.branchName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-admin-textMuted flex-shrink-0" />
                            <div>
                                <p className="text-sm text-admin-textMuted">Start Date</p>
                                <p className="text-admin-text font-medium">{staffData.createdAt ? new Date(staffData.createdAt).toLocaleDateString() : "Unknown"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-admin-surface border border-admin-border rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-admin-text mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Personal Information
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-admin-textMuted flex-shrink-0" />
                            <div>
                                <p className="text-sm text-admin-textMuted">Nationality</p>
                                <p className="text-admin-text font-medium">{staffData.nationality || "Not specified"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-admin-textMuted flex-shrink-0" />
                            <div>
                                <p className="text-sm text-admin-textMuted">Staff ID</p>
                                <p className="text-admin-text font-medium">#{staffData.id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Actions */}
                <div className="bg-admin-surface border border-admin-border rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-admin-text mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        {/* <Button className="w-full justify-start bg-admin-primary hover:bg-admin-primary/80">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                        <Button className="w-full justify-start bg-admin-secondary hover:bg-admin-secondary/80">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Message
                        </Button>
                        <Button className="w-full justify-start bg-admin-accent text-white hover:bg-admin-accent/80">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Staff
                        </Button> */}
                    </div>
                </div>
            </div>


        </div>
    )
}
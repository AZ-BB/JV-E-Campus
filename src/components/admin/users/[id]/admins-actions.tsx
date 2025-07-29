'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import DeleteModal from "@/components/delete-modal";
import { deleteAdminUser, Admin } from "@/actions/admins";
import toaster from "@/components/ui/toast";
import UpdateAdminModal from "../update-admin-modal";

interface UserActionsProps {
    userData: Admin;
}

export default function UserActions({ userData }: UserActionsProps) {
    const router = useRouter();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleEditClick = () => {
        setIsUpdateModalOpen(true);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (userData?.id) {
            const response = await deleteAdminUser(Number(userData.id));
            if (response.error) {
                toaster.error(response.error);
            } else {
                response.message && toaster.success(response.message);
                router.push('/admin/users');
            }
        }
    };

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
    };

    const handleModalClose = () => {
        setIsUpdateModalOpen(false);
        // Refresh the page to show updated data
        router.refresh();
    };

    return (
        <>
            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 md:mt-0">
                <Button
                    className="flex items-center p-2 px-4 gap-2 bg-admin-primary hover:bg-admin-primary/80"
                    onClick={handleEditClick}
                >
                    <Edit className="w-4 h-4" />
                    Edit User
                </Button>
                <Button
                    className="flex items-center p-2 px-4 gap-2 bg-admin-accent text-white hover:bg-admin-accent/80"
                    onClick={handleDeleteClick}
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </Button>
            </div>

            {/* Update User Modal */}
            <UpdateAdminModal
                isOpen={isUpdateModalOpen}
                onClose={handleModalClose}
                userData={userData}
            />

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteModalClose}
                onConfirm={handleDeleteConfirm}
                itemName={userData.fullName}
                itemType="User"
            />
        </>
    );
} 
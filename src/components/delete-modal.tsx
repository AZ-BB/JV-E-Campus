'use client'

import { useState } from "react";
import Button from "./ui/button";
import Input from "./ui/input";
import { ModalRoot, ModalContent, ModalHeader, ModalTitle } from "./ui/modal";
import { AlertTriangle } from "lucide-react";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    itemType: string;
    title?: string;
    description?: string;
}

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    itemType,
    title = `Delete ${itemType}`,
    description = `This action cannot be undone. This will permanently delete the ${itemType.toLowerCase()} "${itemName}" and all associated data.`
}: DeleteModalProps) {
    const [confirmText, setConfirmText] = useState("");
    const requiredText = `delete-${itemName}`;
    const isConfirmValid = confirmText === requiredText;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isConfirmValid) {
            onConfirm();
            handleClose();
        }
    };

    const handleClose = () => {
        setConfirmText("");
        onClose();
    };

    return (
        <ModalRoot open={isOpen} onOpenChange={handleClose}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                </ModalHeader>
                
                <div className="space-y-4">
                    {/* Warning Section */}
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                                Danger Zone
                            </h4>
                            <p className="text-sm text-red-700 dark:text-red-400">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Confirmation Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-admin-text mb-2">
                                To confirm this action, type{" "}
                                <span className="font-mono bg-admin-secondary px-1 py-0.5 rounded text-sm">
                                    {requiredText}
                                </span>{" "}
                                in the box below:
                            </label>
                            <Input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder={`Type "${requiredText}" to confirm`}
                                className="w-full"
                                autoComplete="off"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-end pt-4">
                            <Button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 bg-admin-secondary text-admin-textSecondary hover:bg-admin-secondary/80"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!isConfirmValid}
                                className={`px-4 py-2 text-white ${
                                    isConfirmValid
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                Delete {itemType}
                            </Button>
                        </div>
                    </form>
                </div>
            </ModalContent>
        </ModalRoot>
    );
} 
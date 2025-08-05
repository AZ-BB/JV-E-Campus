import Button from "./ui/button";
import { useEffect, useState } from "react";

export default function DeleteDialog({
    handleDeleteCancel,
    handleDeleteConfirm,
    deleteConfirm,
    text,
    buttonRef,
}: {
    handleDeleteCancel: () => void;
    handleDeleteConfirm: () => void;
    deleteConfirm: { 
        isOpen: boolean; 
        staffId?: string; 
        position?: { top: number; left: number } | null 
    };
    text: string | null;
    buttonRef?: React.RefObject<HTMLDivElement | null>;
}) {
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

    useEffect(() => {
        if (deleteConfirm.isOpen && buttonRef?.current) {
            const button = buttonRef.current;
            const buttonRect = button.getBoundingClientRect();
            const container = button.closest(".relative") as HTMLElement;
            const containerRect = container?.getBoundingClientRect();

            if (!containerRect) return;

            const dialogWidth = 256; // w-64 = 16rem = 256px
            const dialogHeight = 100; // Approximate height

            // Calculate position relative to the container
            const relativeButtonTop = buttonRect.top - containerRect.top;
            const relativeButtonLeft = buttonRect.left - containerRect.left;

            // Calculate initial position (above and centered to button)
            let top = relativeButtonTop - dialogHeight - 10;
            let left = relativeButtonLeft + buttonRect.width / 2 - dialogWidth / 2;

            // Adjust if dialog would go off-screen horizontally
            if (left < 10) {
                left = 10; // Keep 10px from left edge
            } else if (left + dialogWidth > containerRect.width - 10) {
                left = containerRect.width - dialogWidth - 10; // Keep 10px from right edge
            }

            // Adjust if dialog would go off-screen vertically (show below button instead)
            if (top < 10) {
                top = relativeButtonTop + buttonRect.height + 10; // Show below button with 10px gap
            }

            setPosition({ top, left });
        }
    }, [deleteConfirm.isOpen, buttonRef]);

    if (!deleteConfirm.isOpen) return null;

    // Use calculated position or fallback to provided position
    const dialogPosition = position || deleteConfirm.position || { top: 0, left: 0 };

    return (
        <>
            {/* Backdrop to close dialog when clicking outside */}
            <div
                className="fixed inset-0 z-40"
                onClick={handleDeleteCancel}
            />
            {/* Confirmation Dialog */}
            <div
                className="absolute z-50 bg-admin-surface border border-admin-border rounded-lg shadow-lg p-4 w-64"
                style={{
                    top: `${dialogPosition.top}px`,
                    left: `${dialogPosition.left}px`,
                }}
            >
                <div className="text-center">
                    <p className="text-sm text-admin-text-muted mb-4">
                        {text || "Are you sure you want to delete this?"}
                    </p>
                    <div className="flex gap-2 justify-center">
                        <Button
                            onClick={handleDeleteCancel}
                            className="px-3 py-1 text-sm bg-admin-secondary text-admin-textSecondary rounded hover:bg-admin-secondary/80"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            className="px-3 py-1 text-sm bg-admin-accent text-admin-textSecondary rounded hover:bg-admin-accent/80"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
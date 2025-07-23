import Button from "./ui/button";

export default function DeleteDialog({
    handleDeleteCancel,
    handleDeleteConfirm,
    deleteConfirm,
    text,
}: {
    handleDeleteCancel: () => void;
    handleDeleteConfirm: () => void;
    deleteConfirm: { position: { top: number; left: number } | null };
    text: string | null;
}) {

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
                    top: `${deleteConfirm.position?.top || 0}px`,
                    left: `${deleteConfirm.position?.left || 0}px`,
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
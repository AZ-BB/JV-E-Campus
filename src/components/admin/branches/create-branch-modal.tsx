import { useEffect, useState } from "react";
import { ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalRoot, ModalTitle } from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { createBranch } from "@/actions/branches";
import toaster from "@/components/ui/toast";

export default function CreateBranchModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [branchName, setBranchName] = useState("");


    useEffect(() => {
        setError(null)
    }, [branchName])

    useEffect(() => {
        if (isOpen) {
            setBranchName("")
        }
    }, [isOpen])

    const handleCreateBranch = async () => {
        setIsCreating(true)
        const response = await createBranch({
            name: branchName.trim(),
        })
        if (response.error) {
            setError(response.error)
            return
        }
        onClose()
        response.message && toaster.success(response.message)
        setIsCreating(false)
    }

    return (
        <ModalRoot open={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Create Branch</ModalTitle>
                    <ModalDescription>
                        Create a new branch
                    </ModalDescription>
                </ModalHeader>

                <div className="flex flex-col gap-2">
                    <Input required type="text" label="Branch Name" placeholder="Branch Name" value={branchName} onChange={(e) => setBranchName(e.target.value)} className="w-full" />
                </div>
                {error && <p className="text-admin-accent text-sm">{error}</p>}
                <ModalFooter>
                    <Button
                        disabled={!branchName.trim() || !!error}
                        onClick={handleCreateBranch}
                        isLoading={isCreating}
                        className="px-4 py-2"
                    >
                        Create Branch
                    </Button>
                </ModalFooter>


            </ModalContent>
        </ModalRoot>
    )
}
import { useEffect, useState } from "react";
import { ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalRoot, ModalTitle } from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { updateBranch } from "@/actions/branches";
import { Loader2 } from "lucide-react";
import { Branch } from "@/actions/branches";

export default function UpdateBranchModal({
    isOpen,
    onClose,
    branchData,
}: {
    isOpen: boolean;
    onClose: () => void;
    branchData: Branch | null;
}) {
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [branchName, setBranchName] = useState("");

    useEffect(() => {
        setError(null)
    }, [branchName])

    useEffect(() => {
        if (isOpen && branchData) {
            setBranchName(branchData.name || "")
        }
    }, [isOpen, branchData])

    const handleUpdateBranch = async () => {
        if (!branchData) return

        setIsUpdating(true)
        const response = await updateBranch(branchData.id, {
            name: branchName.trim(),
        })
        if (response.error) {
            setError(response.error)
            setIsUpdating(false)
            return
        }
        onClose()
        setIsUpdating(false)
    }

    return (
        <ModalRoot open={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Update Branch</ModalTitle>
                    <ModalDescription>
                        Update branch information
                    </ModalDescription>
                </ModalHeader>

                <div className="flex flex-col gap-2">
                    <Input
                        required
                        type="text"
                        label="Branch Name"
                        placeholder="Branch Name"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        className="w-full"
                        autoFocus={false}
                    />
                </div>
                {error && <p className="text-admin-accent text-sm">{error}</p>}
                <ModalFooter>
                    <Button
                        disabled={!branchName.trim() || !!error || isUpdating}
                        onClick={handleUpdateBranch}
                        isLoading={isUpdating}
                        className="px-4 py-2"
                    >
                        Update Branch
                    </Button>
                </ModalFooter>
            </ModalContent>
        </ModalRoot>
    )
}

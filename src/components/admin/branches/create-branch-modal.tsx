import { useEffect, useState } from "react";
import { ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalRoot, ModalTitle } from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { StaffCategory } from "@/db/enums";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValue } from "@/components/ui/select";
import { branches as branchesTable } from "@/db/schema/schema";
import { createBranch, getBranches } from "@/actions/branches";

export default function CreateBranchModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [error, setError] = useState<string | null>(null);
    const [branches, setBranches] = useState<typeof branchesTable.$inferSelect[]>([]);

    const [branchName, setBranchName] = useState("");

    useEffect(() => {
        const fetchBranchs = async () => {
            const branchesResponse = await getBranches();
            if (branchesResponse.error) {
                setError(branchesResponse.error)
            } else {
                setBranches(branchesResponse.data || []);
            }
        }
        fetchBranchs();
    }, []);

    useEffect(() => {
        setError(null)
    }, [branchName])

    useEffect(() => {
        if (isOpen) {
            setBranchName("")
        }
    }, [isOpen])

    const handleCreateBranch = async () => {
        const response = await createBranch({
            name: branchName,
        })
        if (response.error) {
            setError(response.error)
            return
        }
        onClose()
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
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <ModalFooter>
                    <Button disabled={!branchName || !!error} onClick={handleCreateBranch} >Create Branch</Button>
                </ModalFooter>


            </ModalContent>
        </ModalRoot>
    )
}
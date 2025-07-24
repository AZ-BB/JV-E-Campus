import { useEffect, useState } from "react";
import { ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalRoot, ModalTitle } from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { createRole } from "@/actions/roles";
import toaster from "@/components/ui/toast";

export default function CreateRoleModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [roleName, setRoleName] = useState("");
    const [fullName, setFullName] = useState("");


    useEffect(() => {
        setError(null)
    }, [roleName, fullName])

    useEffect(() => {
        if (isOpen) {
            setRoleName("")
            setFullName("")
        }
    }, [isOpen])

    const handleCreateRole = async () => {
        setIsCreating(true)
        const response = await createRole({
            name: roleName.trim(),
            fullName: fullName.trim(),
        })
        if (response.error) {
            setError(response.error)
            return
        }
        response.message && toaster.success(response.message)
        onClose()
        setIsCreating(false)
    }

    return (
        <ModalRoot open={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Create Role</ModalTitle>
                    <ModalDescription>
                        Create a new role
                    </ModalDescription>
                </ModalHeader>

                <div className="flex flex-col gap-2">
                    <Input required type="text" label="Role Name" placeholder="Role Name" value={roleName} onChange={(e) => setRoleName(e.target.value)} className="w-full" />
                    <Input required type="text" label="Full Name" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full" />
                </div>
                {error && <p className="text-admin-accent text-sm">{error}</p>}
                <ModalFooter>
                    <Button
                        disabled={!roleName.trim() || !fullName.trim() || !!error}
                        onClick={handleCreateRole}
                        loading={isCreating}
                        className="px-4 py-2"
                    >
                        Create Role
                    </Button>
                </ModalFooter>


            </ModalContent>
        </ModalRoot>
    )
}
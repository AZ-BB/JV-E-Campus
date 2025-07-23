import { useEffect, useState } from "react";
import { ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalRoot, ModalTitle } from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { updateRole } from "@/actions/roles";
import { Loader2 } from "lucide-react";
import { Role } from "@/actions/roles";

export default function UpdateRoleModal({
    isOpen,
    onClose,
    roleData,
}: {
    isOpen: boolean;
    onClose: () => void;
    roleData: Role | null;
}) {
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [roleName, setRoleName] = useState("");
    const [fullName, setFullName] = useState("");

    useEffect(() => {
        setError(null)
    }, [roleName, fullName])

    useEffect(() => {
        if (isOpen && roleData) {
            setRoleName(roleData.name || "")
            setFullName(roleData.fullName || "")
        }
    }, [isOpen, roleData])

    const handleUpdateRole = async () => {
        if (!roleData) return
        
        setIsUpdating(true)
        const response = await updateRole(roleData.id, {
            name: roleName.trim(),
            fullName: fullName.trim(),
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
                    <ModalTitle>Update Role</ModalTitle>
                    <ModalDescription>
                        Update role information
                    </ModalDescription>
                </ModalHeader>

                <div className="flex flex-col gap-2">
                    <Input 
                        required 
                        type="text" 
                        label="Role Name" 
                        placeholder="Role Name" 
                        value={roleName} 
                        onChange={(e) => setRoleName(e.target.value)} 
                        className="w-full" 
                        autoFocus={false}
                    />
                    <Input 
                        required 
                        type="text" 
                        label="Full Name" 
                        placeholder="Full Name" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)} 
                        className="w-full" 
                        autoFocus={false}
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <ModalFooter>
                    <Button 
                        disabled={!roleName.trim() || !fullName.trim() || !!error || isUpdating} 
                        onClick={handleUpdateRole}
                    >
                        {isUpdating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            "Update Role"
                        )}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </ModalRoot>
    )
}

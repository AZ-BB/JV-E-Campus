import { createStaffUser } from "@/actions/users";
import { useEffect, useState } from "react";
import { ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalRoot, ModalTitle } from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { StaffCategory } from "@/db/enums";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValue } from "@/components/ui/select";
import { branches as branchesTable } from "@/db/schema/schema";
import { getBranches } from "@/actions/branches";
import { Loader2 } from "lucide-react";

export default function CreateStaffModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [error, setError] = useState<string | null>(null);
    const [branches, setBranches] = useState<typeof branchesTable.$inferSelect[]>([]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [branchId, setBranchId] = useState<number | null>(null);
    const [staffCategory, setStaffCategory] = useState<StaffCategory | null>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [nationality, setNationality] = useState("");
    const [profilePictureUrl, setProfilePictureUrl] = useState("");
    const [resetPasswordOnFirstLogin, setResetPasswordOnFirstLogin] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
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
    }, [email, password, fullName, branchId, staffCategory])

    useEffect(() => {
        if (isOpen) {
            setEmail("")
            setPassword("")
            setFullName("")
            setBranchId(null)
            setStaffCategory(null)
            setPhoneNumber("")
            setNationality("")
            setProfilePictureUrl("")
            setResetPasswordOnFirstLogin(false)
        }
    }, [isOpen])

    const handleCreateStaff = async () => {
        setIsCreating(true)
        const response = await createStaffUser({
            email,
            password,
            fullName,
            branchId: branchId!,
            staffCategory: staffCategory!,
            phoneNumber: phoneNumber,
            nationality: nationality,
            profilePictureUrl: profilePictureUrl,
        })
        if (response.error) {
            setError(response.error)
            return
        }
        onClose()
        setIsCreating(false)
    }
    return (
        <ModalRoot open={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Create Staff</ModalTitle>
                    <ModalDescription>
                        Create a new staff user
                    </ModalDescription>
                </ModalHeader>

                <div className="flex flex-col gap-2">
                    <Input required type="email" label="Email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full" />
                    <Input required type="password" label="Password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full" />
                    <Input required type="text" label="Full Name" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full" />
                    <SelectRoot
                        onSelect={(value) => setStaffCategory(value as StaffCategory)}
                    >
                        <SelectTrigger className="w-full" label="Staff Category" required>
                            <SelectValue placeholder="Select Staff Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={StaffCategory.FOH}>Front of House</SelectItem>
                            <SelectItem value={StaffCategory.BOH}>Back of House</SelectItem>
                            <SelectItem value={StaffCategory.MANAGER}>Management</SelectItem>
                        </SelectContent>
                    </SelectRoot>

                    <SelectRoot
                        onSelect={(value) => setBranchId(Number(value))}
                    >
                        <SelectTrigger className="w-full" label="Branch" required>
                            <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent>
                            {branches.map((branch) => (
                                <SelectItem key={branch.id} value={branch.id.toString()}>{branch.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </SelectRoot>

                    <Input type="text" label="Phone Number" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full" />
                    <Input type="text" label="Nationality" placeholder="Nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} className="w-full" />
                    <Checkbox
                        checked={resetPasswordOnFirstLogin}
                        onCheckedChange={() => setResetPasswordOnFirstLogin(!resetPasswordOnFirstLogin)}
                        label="Reset Password On First Login"
                        className="w-5 h-5 rounded-md"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <ModalFooter>
                    <Button disabled={
                        !email.trim() ||
                        !password.trim() ||
                        !fullName.trim() ||
                        !staffCategory ||
                        !branchId ||
                        !!error ||
                        isCreating
                    } onClick={handleCreateStaff}>{
                        isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Staff"
                    }</Button>
                </ModalFooter>
            </ModalContent>
        </ModalRoot>
    )
}
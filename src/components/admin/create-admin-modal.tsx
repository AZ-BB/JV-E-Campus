import { createAdminUser } from "@/actions/users";
import { useEffect, useState } from "react";
import { ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalOverlay, ModalPortal, ModalRoot, ModalTitle } from "../ui/modal";
import Input from "../ui/input";
import Button from "../ui/button";
import Checkbox from "../ui/checkbox";

export default function CreateAdminModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [resetPasswordOnFirstLogin, setResetPasswordOnFirstLogin] = useState(false);

    useEffect(() => {
        setError(null)
    }, [email, password, fullName])

    useEffect(() => {
        if (isOpen) {
            setEmail("")
            setPassword("")
            setFullName("")
            setResetPasswordOnFirstLogin(false)
        }
    }, [isOpen])

    const handleCreateAdmin = async () => {
        const response = await createAdminUser({
            email,
            password,
            fullName,
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
                    <ModalTitle>Create Admin</ModalTitle>
                    <ModalDescription>
                        Create a new admin user
                    </ModalDescription>
                </ModalHeader>
                <div className="flex flex-col gap-2">
                    <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full" />
                    <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full" />
                    <Input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full" />
                    <Checkbox
                        checked={resetPasswordOnFirstLogin}
                        onCheckedChange={() => setResetPasswordOnFirstLogin(!resetPasswordOnFirstLogin)}
                        label="Reset Password On First Login"
                        className="w-5 h-5 rounded-md"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <ModalFooter>
                    <Button disabled={!email.trim() || !password.trim() || !fullName.trim() || !!error} onClick={handleCreateAdmin} >Create Admin</Button>
                </ModalFooter>
            </ModalContent>
        </ModalRoot>
    )
}
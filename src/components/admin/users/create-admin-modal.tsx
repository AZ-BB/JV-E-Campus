import { createAdminUser } from "@/actions/admins"
import { useEffect, useState } from "react"
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalRoot,
  ModalTitle,
} from "@/components/ui/modal"
import Input from "@/components/ui/input"
import Button from "@/components/ui/button"
import Checkbox from "@/components/ui/checkbox"
import ProfilePicture from "@/components/ui/profile-picture"
import toaster from "@/components/ui/toast"
import { uploadFile } from "@/actions/upload"
import { v4 as uuidv4 } from 'uuid'

export default function CreateAdminModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [error, setError] = useState<string | null>(null)


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [profilePictureUrl, setProfilePictureUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [profilePictureError, setProfilePictureError] = useState<string | null>(null)
  const [resetPasswordOnFirstLogin, setResetPasswordOnFirstLogin] =
    useState(false)
  const [isCreating, setIsCreating] = useState(false)


  useEffect(() => {
    setError(null)
  }, [email, password, fullName])

  useEffect(() => {
    if (isOpen) {
      setEmail("")
      setPassword("")
      setFullName("")
      setProfilePictureUrl("")
      setSelectedFile(null)
      setProfilePictureError(null)
      setResetPasswordOnFirstLogin(false)
    }
  }, [isOpen])

  const handleCreateStaff = async () => {
    setIsCreating(true)

    let finalProfilePictureUrl = ""

    // Upload the profile picture first if one is selected
    if (selectedFile) {
      const name = uuidv4()
      const fileName = name + "." + selectedFile.type.split("/")[1]
      const uploadResponse = await uploadFile(selectedFile, "avatars", fileName)

      if (uploadResponse.error) {
        setProfilePictureError(uploadResponse.error)
        setIsCreating(false)
        return
      }

      finalProfilePictureUrl = fileName
    }

    console.log(finalProfilePictureUrl)
    const response = await createAdminUser({
      email,
      password,
      fullName,
      profilePictureUrl: finalProfilePictureUrl
    })
    if (response.error) {
      setError(response.error)
      setIsCreating(false)
      return
    }
    onClose()
    response.message && toaster.success(response.message)
    setIsCreating(false)
  }

  const handleProfilePictureUpload = async (file: File) => {
    setProfilePictureError(null)
    // Create a temporary URL for preview
    const tempUrl = URL.createObjectURL(file)
    setProfilePictureUrl(tempUrl)
    setSelectedFile(file)
  }

  const handleProfilePictureRemove = () => {
    // Clean up the temporary URL if it exists
    if (profilePictureUrl && profilePictureUrl.startsWith('blob:')) {
      URL.revokeObjectURL(profilePictureUrl)
    }
    setProfilePictureUrl("")
    setSelectedFile(null)
  }

  // Clean up temporary URL when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (profilePictureUrl && profilePictureUrl.startsWith('blob:')) {
        URL.revokeObjectURL(profilePictureUrl)
      }
    }
  }, [profilePictureUrl])

  return (
    <ModalRoot open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create Admin</ModalTitle>
          <ModalDescription>Create a new admin user</ModalDescription>
        </ModalHeader>

        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-center items-center flex-col gap-2">
            <ProfilePicture
              src={profilePictureUrl}
              alt={fullName || "Profile picture"}
              size="lg"
              className="w-28 h-28"
              onUpload={handleProfilePictureUpload}
              onRemove={handleProfilePictureRemove}
            />
            {profilePictureError && <p className="text-admin-accent text-sm">{profilePictureError}</p>}
          </div>
          <Input
            required
            type="email"
            label="Email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
          <Input
            required
            type="password"
            label="Password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
          <Input
            required
            type="text"
            label="Full Name"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full"
          />

          <Checkbox
            checked={resetPasswordOnFirstLogin}
            onCheckedChange={() =>
              setResetPasswordOnFirstLogin(!resetPasswordOnFirstLogin)
            }
            label="Reset Password On First Login"
            className="w-5 h-5 rounded-md"
          />
        </div>
        {error && <p className="text-admin-accent text-sm">{error}</p>}

        <ModalFooter>
          <Button
            isLoading={isCreating}
            className="px-4 py-2"
            disabled={
              !email.trim() ||
              !password.trim() ||
              !fullName.trim() ||
              !!error ||
              isCreating
            }
            onClick={handleCreateStaff}
          >
            Create Admin
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalRoot>
  )
}

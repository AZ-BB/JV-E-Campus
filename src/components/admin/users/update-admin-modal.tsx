import { updateAdminUser } from "@/actions/admins"
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
import ProfilePicture from "@/components/ui/profile-picture"
import { Admin } from "@/actions/admins"
import toaster from "@/components/ui/toast"
import { v4 as uuidv4 } from "uuid"
import { uploadFile } from "@/actions/upload"

export default function UpdateAdminModal({
  isOpen,
  onClose,
  userData,
}: {
  isOpen: boolean
  onClose: () => void
  userData: Admin | null
}) {
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [profilePictureUrl, setProfilePictureUrl] = useState("")
  const [profilePictureTempUrl, setProfilePictureTempUrl] = useState("")
  const [profilePictureError, setProfilePictureError] = useState<string | null>(
    null
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setError(null)
  }, [email, fullName])

  useEffect(() => {
    if (isOpen && userData) {
      setEmail(userData.email || "")
      setFullName(userData.fullName || "")
      setProfilePictureUrl(userData.profilePictureUrl || "")
      setProfilePictureTempUrl("")
      setSelectedFile(null)
      setProfilePictureError(null)
    }
  }, [isOpen, userData])

  const handleProfilePictureUpload = async (file: File) => {
    setProfilePictureError(null)
    const tempUrl = URL.createObjectURL(file)
    setProfilePictureTempUrl(tempUrl)
    setSelectedFile(file)
  }

  const handleProfilePictureRemove = () => {
    setProfilePictureUrl("")
    setProfilePictureTempUrl("")
    setSelectedFile(null)
  }

  const handleUpdateStaff = async () => {
    if (!userData) return
    setIsUpdating(true)
    let finalProfilePictureUrl = profilePictureUrl
    let databaseProfilePictureUrl = profilePictureUrl
    if (selectedFile) {
      if (userData.profilePictureUrl) {
        finalProfilePictureUrl = userData.profilePictureUrl
        databaseProfilePictureUrl = userData.profilePictureUrl.split(".").slice(0, -1).join(".") +
          "." +
          selectedFile.type.split("/")[1]
      } else {
        const name = uuidv4()
        finalProfilePictureUrl = name + "." + selectedFile.type.split("/")[1]
        databaseProfilePictureUrl = name + "." + selectedFile.type.split("/")[1]
      }
      const uploadResponse = await uploadFile(
        selectedFile,
        "avatars",
        finalProfilePictureUrl
      )
      if (uploadResponse.error) {
        setProfilePictureError(uploadResponse.error)
        setIsUpdating(false)
        return
      }
    }
    const response = await updateAdminUser(userData.id, {
      fullName,
      profilePictureUrl: finalProfilePictureUrl
    })
    if (response.error) {
      setError(response.error)
      setIsUpdating(false)
      return
    }
    onClose()
    response.message && toaster.success(response.message)
    setIsUpdating(false)
  }

  return (
    <ModalRoot open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Update Admin</ModalTitle>
          <ModalDescription>Update admin user information</ModalDescription>
        </ModalHeader>

        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-center items-center flex-col gap-2">
            <ProfilePicture
              src={
                profilePictureTempUrl ||
                (profilePictureUrl
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_NAME}/${process.env.NEXT_PUBLIC_STORAGE_AVATAR_DIRECTORY}/${profilePictureUrl}`
                  : "")
              }
              alt={fullName || "Profile picture"}
              size="lg"
              className="w-28 h-28"
              onUpload={handleProfilePictureUpload}
              onRemove={handleProfilePictureRemove}
            />
            {profilePictureError && (
              <p className="text-admin-accent text-sm">{profilePictureError}</p>
            )}
          </div>
          <Input
            required
            type="email"
            label="Email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            disabled
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
        {error && <p className="text-admin-accent text-sm">{error}</p>}

        <ModalFooter>
          <Button
            isLoading={isUpdating}
            className="px-4 py-2"
            disabled={
              !email.trim() ||
              !fullName.trim() ||
              !!error ||
              isUpdating
            }
            onClick={handleUpdateStaff}
          >
            Update Admin
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalRoot>
  )
}

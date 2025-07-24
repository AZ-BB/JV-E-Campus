import { updateStaffUser } from "@/actions/users"
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
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getBranchesNames } from "@/actions/branches"
import { getRolesNames } from "@/actions/roles"
import countryList from "country-list"
import { Staff } from "@/actions/users"
import toaster from "@/components/ui/toast"
import { v4 as uuidv4 } from "uuid"
import { uploadFile } from "@/actions/upload"

export default function UpdateStaffModal({
  isOpen,
  onClose,
  staffData,
}: {
  isOpen: boolean
  onClose: () => void
  staffData: Staff | null
}) {
  const [error, setError] = useState<string | null>(null)
  const [branches, setBranches] = useState<{ label: string, value: number }[]>([])
  const [roles, setRoles] = useState<{ label: string, value: number }[]>([])
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [branchId, setBranchId] = useState<number | null>(null)
  const [staffRoleId, setStaffRoleId] = useState<number | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [nationality, setNationality] = useState("")
  const [profilePictureUrl, setProfilePictureUrl] = useState("")
  const [profilePictureTempUrl, setProfilePictureTempUrl] = useState("")
  const [profilePictureError, setProfilePictureError] = useState<string | null>(
    null
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const countries = countryList.getNames()

  useEffect(() => {
    const fetchBranchs = async () => {
      const branchesResponse = await getBranchesNames()
      if (branchesResponse.error) {
        setError(branchesResponse.error)
      } else {
        setBranches(branchesResponse.data?.map((branch) => ({ label: branch.name, value: branch.id })) || [])
      }
    }
    const fetchRoles = async () => {
      const rolesResponse = await getRolesNames()
      if (rolesResponse.error) {
        setError(rolesResponse.error)
      } else {
        setRoles(rolesResponse.data?.map((role) => ({ label: role.name, value: role.id })) || [])
      }
    }
    fetchBranchs()
    fetchRoles()
  }, [])

  useEffect(() => {
    setError(null)
  }, [email, fullName, branchId, staffRoleId])

  useEffect(() => {
    if (isOpen && staffData) {
      setEmail(staffData.email || "")
      setFullName(staffData.fullName || "")
      setBranchId(staffData.branchId || null)
      setStaffRoleId(staffData.staffRoleId || null)
      setPhoneNumber(staffData.phoneNumber || "")
      setNationality(staffData.nationality || "")
      setProfilePictureUrl(staffData.profilePictureUrl || "")
      setProfilePictureTempUrl("")
      setSelectedFile(null)
      setProfilePictureError(null)
    }
  }, [isOpen, staffData])

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
    if (!staffData) return
    setIsUpdating(true)
    let finalProfilePictureUrl = profilePictureUrl
    let databaseProfilePictureUrl = profilePictureUrl
    if (selectedFile) {
      if (staffData.profilePictureUrl) {
        finalProfilePictureUrl = staffData.profilePictureUrl
        databaseProfilePictureUrl = staffData.profilePictureUrl.split(".").slice(0, -1).join(".") +
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
    const response = await updateStaffUser(staffData.id, {
      fullName,
      branchId: branchId!,
      staffRoleId: staffRoleId!,
      phoneNumber: phoneNumber,
      nationality: nationality,
      profilePictureUrl: databaseProfilePictureUrl,
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
          <ModalTitle>Update Staff</ModalTitle>
          <ModalDescription>Update staff user information</ModalDescription>
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
          <SelectRoot
            value={staffRoleId?.toString()}
            onSelect={(value) => setStaffRoleId(Number(value))}
          >
            <SelectTrigger className="w-full" label="Staff Role" required>
              <SelectValue placeholder="Select Staff Role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value.toString()}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>

          <SelectRoot
            value={branchId?.toString()}
            onSelect={(value) => setBranchId(Number(value))}
          >
            <SelectTrigger className="w-full" label="Branch" required>
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.value} value={branch.value.toString()}>
                  {branch.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>

          <Input
            type="text"
            label="Phone Number"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full"
          />
          <SelectRoot
            value={nationality}
            onSelect={(value) => setNationality(value as string)}
          >
            <SelectTrigger className="w-full" label="Nationality">
              <SelectValue placeholder="Select Nationality" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </div>
        {error && <p className="text-admin-accent text-sm">{error}</p>}

        <ModalFooter>
          <Button
            isLoading={isUpdating}
            className="px-4 py-2"
            disabled={
              !email.trim() ||
              !fullName.trim() ||
              !staffRoleId ||
              !branchId ||
              !!error ||
              isUpdating
            }
            onClick={handleUpdateStaff}
          >
            Update Staff
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalRoot>
  )
}

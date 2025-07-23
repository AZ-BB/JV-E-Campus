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
import { StaffCategory } from "@/db/enums"
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { branches as branchesTable, staffRoles } from "@/db/schema/schema"
import { getBranches } from "@/actions/branches"
import { Loader2 } from "lucide-react"
import { getRoles } from "@/actions/roles"
import countryList from "country-list"
import { Staff } from "@/actions/users"

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
  const [branches, setBranches] = useState<
    (typeof branchesTable.$inferSelect)[]
  >([])
  const [roles, setRoles] = useState<typeof staffRoles.$inferSelect[]>([])
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [branchId, setBranchId] = useState<number | null>(null)
  const [staffRoleId, setStaffRoleId] = useState<number | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [nationality, setNationality] = useState("")
  const [profilePictureUrl, setProfilePictureUrl] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const countries = countryList.getNames()
  
  useEffect(() => {
    const fetchBranchs = async () => {
      const branchesResponse = await getBranches()
      if (branchesResponse.error) {
        setError(branchesResponse.error)
      } else {
        setBranches(branchesResponse.data || [])
      }
    }
    const fetchRoles = async () => {
      const rolesResponse = await getRoles()
      if (rolesResponse.error) {
        setError(rolesResponse.error)
      } else {
        setRoles(rolesResponse.data || [])
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
    }
  }, [isOpen, staffData])

  const handleUpdateStaff = async () => {
    if (!staffData) return
    
    setIsUpdating(true)
    const response = await updateStaffUser(staffData.id, {
      fullName,
      branchId: branchId!,
      staffRoleId: staffRoleId!,
      phoneNumber: phoneNumber,
      nationality: nationality,
      profilePictureUrl: profilePictureUrl,
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
          <ModalTitle>Update Staff</ModalTitle>
          <ModalDescription>Update staff user information</ModalDescription>
        </ModalHeader>

        <div className="flex flex-col gap-2">
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
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name} - {role.fullName}
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
                <SelectItem key={branch.id} value={branch.id.toString()}>
                  {branch.name}
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
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          <Input
            type="text"
            label="Profile Picture URL"
            placeholder="Profile Picture URL"
            value={profilePictureUrl}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
            className="w-full"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <ModalFooter>
          <Button
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
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Update Staff"
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalRoot>
  )
}

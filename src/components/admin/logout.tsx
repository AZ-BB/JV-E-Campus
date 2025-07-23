"use client"
import { createSupabaseClient } from "@/utils/supabase-browser"
import { useRouter } from "next/navigation"
import Button from "../ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
const Logout = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const logout = async () => {
    setLoading(true)
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
    router.push("/auth/sign-in")
    setLoading(false)
  }
  return (
    <Button onClick={logout} disabled={loading} className="px-4 py-2">
      {
        loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Log Out"
        )
      }
    </Button>
  )
}
export default Logout

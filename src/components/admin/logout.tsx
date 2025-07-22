"use client"
import { createSupabaseClient } from "@/utils/supabase-browser"
import { useRouter } from "next/navigation"
const Logout = () => {
  const router = useRouter()
  const logout = async () => {
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
    router.push("/auth/sign-in")
  }
  return <button onClick={logout}>Log Out</button>
}
export default Logout

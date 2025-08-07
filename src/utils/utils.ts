import { createSupabaseServerClient } from "./supabase-server"

export const mapAvatarImageUrl = (imageUrl: string) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_NAME}/${process.env.NEXT_PUBLIC_STORAGE_AVATAR_DIRECTORY}/${imageUrl}`
}
export const mapIconUrl = (imageUrl: string) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_NAME}/${process.env.NEXT_PUBLIC_STORAGE_ICONS_DIRECTORY}/${imageUrl}`
}
export const getCurrentUser = async () => {
    const supabase = await createSupabaseServerClient()

    const { data: currentUser, error: currentUserError } = await supabase.auth.getUser()

    if (currentUserError) {
        console.error("GET CURRENT USER ERROR - ", currentUserError.message)
        throw new Error(currentUserError.message)
    }

    return currentUser

}
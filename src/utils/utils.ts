export const mapAvatarImageUrl = (imageUrl: string) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_NAME}/${process.env.NEXT_PUBLIC_STORAGE_AVATAR_DIRECTORY}/${imageUrl}`
}
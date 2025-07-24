import responses from "@/responses/responses"
import { createSupabaseClient } from "@/utils/supabase-browser"

// Base upload function
export const uploadFile = async (file: File, path: string, name: string) => {
  const supabase = createSupabaseClient()
  try {
    console.log(`${path}/${name}`)
    // First, try to delete the existing file (ignore error if file doesn't exist)
    const { data: deleteData, error: deleteError } = await supabase.storage
      .from("main")
      .remove([`${path}/${name}`])
    console.log(deleteData)
    if (deleteError) {
      console.error(deleteError)
    }

    // Then upload the new file
    const { data, error } = await supabase.storage
      .from("main")
      .upload(`${path}/${name.split(".").slice(0, -1).join(".")}.${file.type.split("/")[1]}`, file, {
        cacheControl: "3600",
      })
    if (error) {
      console.error(error)
      return { error: responses.upload.error.general }
    }
    console.log(data)
    return { data: data.path }
  } catch (error) {
    console.error(error)
    return { error: responses.upload.error.general }
  }
}

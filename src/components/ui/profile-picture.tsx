import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useRef } from "react"
import { cn } from "@/utils/cn"

interface ProfilePictureProps {
  src?: string | null
  alt?: string
  size?: "sm" | "md" | "lg"
  onUpload?: (file: File) => void
  onRemove?: () => void
  className?: string
  disabled?: boolean
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-16 h-16", 
  lg: "w-24 h-24"
}

export default function ProfilePicture({
  src,
  alt = "Profile picture",
  size = "md",
  onUpload,
  onRemove,
  className,
  disabled = false
}: ProfilePictureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onUpload) {
      onUpload(file)
    }
    e.target.value = ''
  }

  const defaultImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzciIHI9IjEyIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMCA4M2MwLTE2LjU2OSAxMy40MzEtMzAgMzAtMzBzMzAgMTMuNDMxIDMwIDMwdjEwSDIwVjgzWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K"

  if (disabled) {
    return (
      <div className={cn(
        "rounded-full border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center",
        sizeClasses[size],
        className
      )}>
        <img
          src={src || defaultImage}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className={cn(
              "rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              sizeClasses[size],
              className
            )}
            type="button"
          >
            <img
              src={src || defaultImage}
              alt={alt}
              className="w-full h-full object-cover"
            />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[160px] bg-white rounded-md p-1 shadow-lg border border-gray-200 z-50"
            sideOffset={5}
          >
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded cursor-pointer outline-none"
              onClick={handleUploadClick}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload
            </DropdownMenu.Item>
            
            {src && onRemove && (
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded cursor-pointer outline-none"
                onClick={onRemove}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove profile picture
              </DropdownMenu.Item>
            )}

            <DropdownMenu.Arrow className="fill-white" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        maxLength={2097152} // 2MB
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  )
} 
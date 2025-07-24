'use client'
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

export default function Button({
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean
}) {
    return (
        <button {...props} className={cn("bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", props.className)} >
            {
                props.isLoading && <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
            }
            {props.children}
        </button>
    )
}

import { cn } from "@/utils/cn";

export default function Button({
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return <button className={cn("bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", props.className)} {...props} />
}

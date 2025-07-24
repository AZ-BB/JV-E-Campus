import { cn } from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    labelClassName?: string;
    required?: boolean;
}

export default function Input({
    className,
    label,
    labelClassName,
    required,
    ...props
}: InputProps) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className={cn("block text-sm font-medium text-admin-text-muted", labelClassName)}>
                    {label} {
                        required && <span className="text-admin-accent">*</span>
                    }
                </label>
            )}
            <input
                className={cn("w-full rounded-md border border-admin-border p-2 focus:ring-1 focus:outline-none bg-admin-surface text-admin-text disabled:bg-admin-border disabled:text-admin-text-muted disabled:cursor-not-allowed placeholder:text-gray-500", className)}
                {...props}
            />
        </div>
    );
}

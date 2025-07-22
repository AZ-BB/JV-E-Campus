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
        <div className="space-y-1">
            {label && (
                <label className={cn("block text-sm font-medium text-gray-700", labelClassName)}>
                    {label} {
                        required && <span className="text-red-500">*</span>
                    }
                </label>
            )}
            <input
                className={cn("w-full rounded-md border border-gray-300 p-2 focus:ring-1 focus:outline-none", className)}
                {...props}
            />
        </div>
    );
}

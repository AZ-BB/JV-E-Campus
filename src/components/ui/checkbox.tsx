import { cn } from "@/utils/cn";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { forwardRef } from "react";

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
    label?: string;
    labelClassName?: string;
    description?: string;
    descriptionClassName?: string;
    error?: string;
    errorClassName?: string;
}

const Checkbox = forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    CheckboxProps
>(({ 
    className, 
    label, 
    labelClassName, 
    description, 
    descriptionClassName,
    error,
    errorClassName,
    id,
    ...props 
}, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const checkboxElement = (
        <CheckboxPrimitive.Root
            ref={ref}
            id={checkboxId}
            className={cn(
                "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white",
                className
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator className="flex items-center justify-center">
                <svg
                    className="h-4 w-4"
                    fill="white"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        clipRule="evenodd"
                    />
                </svg>
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );

    if (!label && !description && !error) {
        return checkboxElement;
    }

    return (
        <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
                {checkboxElement}
                <div className="flex flex-col space-y-1">
                    {label && (
                        <label
                            htmlFor={checkboxId}
                            className={cn(
                                "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                                labelClassName
                            )}
                        >
                            {label}
                        </label>
                    )}
                    {description && (
                        <p className={cn("text-sm text-gray-500", descriptionClassName)}>
                            {description}
                        </p>
                    )}
                </div>
            </div>
            {error && (
                <p className={cn("text-sm text-red-600", errorClassName)}>
                    {error}
                </p>
            )}
        </div>
    );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;

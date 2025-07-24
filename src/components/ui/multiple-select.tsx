import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/utils/cn";

interface MultipleSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface MultipleSelectProps {
    options: MultipleSelectOption[];
    value?: string[];
    onValueChange?: (value: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    label?: string;
    required?: boolean;
    maxDisplayed?: number;
    renderItem?: (option: MultipleSelectOption) => React.ReactNode;
}

const MultipleSelect = React.forwardRef<
    HTMLDivElement,
    MultipleSelectProps
>(({
    options = [],
    value = [],
    onValueChange,
    placeholder = "Select options...",
    disabled = false,
    className,
    label,
    required,
    maxDisplayed = 3,
    renderItem,
    ...props
}, ref) => {
    const [open, setOpen] = React.useState(false);

    const handleValueChange = (optionValue: string, checked: boolean) => {
        if (!onValueChange) return;

        if (checked) {
            onValueChange([...value, optionValue]);
        } else {
            onValueChange(value.filter(v => v !== optionValue));
        }
    };

    const getDisplayText = () => {
        if (value.length === 0) return placeholder;

        const selectedLabels = options
            .filter(option => value.includes(option.value))
            .map(option => option.label);

        if (selectedLabels.length <= maxDisplayed) {
            return selectedLabels.join(", ");
        }

        return `${selectedLabels.slice(0, maxDisplayed).join(", ")} +${selectedLabels.length - maxDisplayed} more`;
    };

    return (
        <div className="flex flex-col gap-2" ref={ref} {...props}>
            {label && (
                <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <Popover.Root open={open} onOpenChange={setOpen}>
                <MultipleSelectTrigger
                    className={className}
                    disabled={disabled}
                    displayText={getDisplayText()}
                    hasValue={value.length > 0}
                />
                <MultipleSelectContent className="w-full">
                    {options.map((option) => (
                        <MultipleSelectItem
                            key={option.value}
                            option={option}
                            checked={value.includes(option.value)}
                            onCheckedChange={(checked) => handleValueChange(option.value, checked === true)}
                            renderItem={renderItem}
                        />
                    ))}
                    {options.length === 0 && (
                        <div className="py-6 text-center text-sm text-gray-500">
                            No options available
                        </div>
                    )}
                </MultipleSelectContent>
            </Popover.Root>
        </div>
    );
});
MultipleSelect.displayName = "MultipleSelect";

const MultipleSelectTrigger = React.forwardRef<
    React.ElementRef<typeof Popover.Trigger>,
    React.ComponentPropsWithoutRef<typeof Popover.Trigger> & {
        displayText: string;
        hasValue: boolean;
    }
>(({ className, displayText, hasValue, ...props }, ref) => (
    <Popover.Trigger
        ref={ref}
        className={cn(
            "flex h-11 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
            !hasValue && "text-gray-500",
            className
        )}
        {...props}
    >
        <span className="truncate">{displayText}</span>
        <MultipleSelectIcon />
    </Popover.Trigger>
));
MultipleSelectTrigger.displayName = "MultipleSelectTrigger";

const MultipleSelectIcon = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
    <span ref={ref} className={cn("h-4 w-4 opacity-50", className)} {...props}>
        <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="m4.93179 5.43179c.20299-.20299.532-.20299.73499 0l2.33292 2.33293 2.33292-2.33293c.203-.20299.532-.20299.735 0 .2029.203.2029.532 0 .73499l-2.66992 2.66992c-.20299.20299-.53201.20299-.735 0l-2.66992-2.66992c-.20299-.20299-.20299-.53199 0-.73499z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
            />
        </svg>
    </span>
));
MultipleSelectIcon.displayName = "MultipleSelectIcon";

const MultipleSelectContent = React.forwardRef<
    React.ElementRef<typeof Popover.Content>,
    React.ComponentPropsWithoutRef<typeof Popover.Content>
>(({ className, children, ...props }, ref) => (
    <Popover.Portal>
        <Popover.Content
            ref={ref}
            className={cn(
                "z-50 max-h-96 w-full min-w-[--radix-popover-trigger-width] overflow-hidden rounded-md border border-admin-border bg-admin-surface text-admin-text shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className
            )}
            align="start"
            sideOffset={4}
            {...props}
        >
            <MultipleSelectViewport>
                {children}
            </MultipleSelectViewport>
        </Popover.Content>
    </Popover.Portal>
));
MultipleSelectContent.displayName = "MultipleSelectContent";

const MultipleSelectViewport = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("p-1 max-h-80 overflow-y-auto", className)}
        {...props}
    />
));
MultipleSelectViewport.displayName = "MultipleSelectViewport";

const MultipleSelectItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        option: MultipleSelectOption;
        checked: boolean;
        onCheckedChange: (checked: boolean) => void;
        renderItem?: (option: MultipleSelectOption) => React.ReactNode;
    }
>(({ className, option, checked, onCheckedChange, renderItem, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none bg-admin-surface hover:bg-gray-200/80 hover:dark:bg-gray-500/80 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            option.disabled && "pointer-events-none opacity-50",
            className
        )}
        onClick={() => !option.disabled && onCheckedChange(!checked)}
        tabIndex={option.disabled ? -1 : 0}
        onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !option.disabled) {
                e.preventDefault();
                onCheckedChange(!checked);
            }
        }}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            {checked && <MultipleSelectItemIndicator />}
        </span>
        {renderItem ? renderItem(option) : <MultipleSelectItemText>{option.label}</MultipleSelectItemText>}
    </div>
));
MultipleSelectItem.displayName = "MultipleSelectItem";

const MultipleSelectItemText = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
    <span ref={ref} className={cn("flex-1 text-admin-text", className)} {...props} />
));
MultipleSelectItemText.displayName = "MultipleSelectItemText";

const MultipleSelectItemIndicator = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
    <span ref={ref} className={cn("flex h-3.5 w-3.5 items-center justify-center text-admin-text hover:text-admin-textSecondaryMuted", className)} {...props}>
        <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="m11.4669 3.72684c.2636.18558.3188.54297.1333.79659l-5.49997 7.49997c-.09334.1273-.24126.2023-.40417.2023-.16291 0-.31083-.0749-.40417-.2023l-2.99997-4.09997c-.18558-.25362-.13037-.61101.13329-.79659.2636-.18558.61101-.13037.79659.13329l2.59588 3.54405 5.09588-6.95405c.1856-.25362.5429-.30883.7966-.13329z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
            />
        </svg>
    </span>
));
MultipleSelectItemIndicator.displayName = "MultipleSelectItemIndicator";

const MultipleSelectLabel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
        {...props}
    />
));
MultipleSelectLabel.displayName = "MultipleSelectLabel";

const MultipleSelectSeparator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
        {...props}
    />
));
MultipleSelectSeparator.displayName = "MultipleSelectSeparator";

// Clear all selected values
const MultipleSelectClearButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        onClear: () => void;
    }
>(({ className, onClear, children, ...props }, ref) => (
    <button
        ref={ref}
        type="button"
        className={cn(
            "flex w-full items-center justify-center rounded-sm py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            className
        )}
        onClick={onClear}
        {...props}
    >
        {children || "Clear all"}
    </button>
));
MultipleSelectClearButton.displayName = "MultipleSelectClearButton";

export {
    MultipleSelect,
    MultipleSelectTrigger,
    MultipleSelectIcon,
    MultipleSelectContent,
    MultipleSelectViewport,
    MultipleSelectItem,
    MultipleSelectItemText,
    MultipleSelectItemIndicator,
    MultipleSelectLabel,
    MultipleSelectSeparator,
    MultipleSelectClearButton,
    type MultipleSelectOption,
    type MultipleSelectProps,
};

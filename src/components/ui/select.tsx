import * as Select from "@radix-ui/react-select";
import * as React from "react";

const SelectRoot = ({
    onSelect,
    ...props
}: React.ComponentPropsWithoutRef<typeof Select.Root> & {
    onSelect?: (value: string) => void;
}) => (
    <Select.Root
        onValueChange={onSelect}
        {...props}
    />
);
SelectRoot.displayName = "SelectRoot";

const SelectGroup = Select.Group;

const SelectValue = Select.Value;

const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof Select.Trigger>,
    React.ComponentPropsWithoutRef<typeof Select.Trigger> & {
        label?: string;
        required?: boolean;
    }
>(({ className, children, label, required, ...props }, ref) => (
    <div className="flex flex-col gap-2">
        {label && (
            <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
        )}
        <Select.Trigger
            ref={ref}
            className={`flex h-11 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        >
            {children}
            <SelectIcon />
        </Select.Trigger>
    </div>
));
SelectTrigger.displayName = Select.Trigger.displayName;

const SelectIcon = React.forwardRef<
    React.ElementRef<typeof Select.Icon>,
    React.ComponentPropsWithoutRef<typeof Select.Icon>
>(({ className, ...props }, ref) => (
    <Select.Icon ref={ref} className={`h-4 w-4 opacity-50 ${className}`} {...props}>
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
    </Select.Icon>
));
SelectIcon.displayName = Select.Icon.displayName;

const SelectPortal = Select.Portal;

const SelectContent = React.forwardRef<
    React.ElementRef<typeof Select.Content>,
    React.ComponentPropsWithoutRef<typeof Select.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
    <SelectPortal>
        <Select.Content
            ref={ref}
            className={`relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-gray-300 bg-white text-gray-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${
                position === "popper" &&
                "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
            } ${className}`}
            position={position}
            {...props}
        >
            <SelectScrollUpButton />
            <SelectViewport className={position === "popper" ? "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]" : ""}>
                {children}
            </SelectViewport>
            <SelectScrollDownButton />
        </Select.Content>
    </SelectPortal>
));
SelectContent.displayName = Select.Content.displayName;

const SelectViewport = React.forwardRef<
    React.ElementRef<typeof Select.Viewport>,
    React.ComponentPropsWithoutRef<typeof Select.Viewport>
>(({ className, ...props }, ref) => (
    <Select.Viewport
        ref={ref}
        className={`p-1 ${className}`}
        {...props}
    />
));
SelectViewport.displayName = Select.Viewport.displayName;

const SelectItem = React.forwardRef<
    React.ElementRef<typeof Select.Item>,
    React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ className, children, ...props }, ref) => (
    <Select.Item
        ref={ref}
        className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <SelectItemIndicator />
        </span>
        <SelectItemText>{children}</SelectItemText>
    </Select.Item>
));
SelectItem.displayName = Select.Item.displayName;

const SelectItemText = React.forwardRef<
    React.ElementRef<typeof Select.ItemText>,
    React.ComponentPropsWithoutRef<typeof Select.ItemText>
>(({ className, ...props }, ref) => (
    <Select.ItemText ref={ref} className={className} {...props} />
));
SelectItemText.displayName = Select.ItemText.displayName;

const SelectItemIndicator = React.forwardRef<
    React.ElementRef<typeof Select.ItemIndicator>,
    React.ComponentPropsWithoutRef<typeof Select.ItemIndicator>
>(({ className, ...props }, ref) => (
    <Select.ItemIndicator ref={ref} className={`flex h-3.5 w-3.5 items-center justify-center ${className}`} {...props}>
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
    </Select.ItemIndicator>
));
SelectItemIndicator.displayName = Select.ItemIndicator.displayName;

const SelectLabel = React.forwardRef<
    React.ElementRef<typeof Select.Label>,
    React.ComponentPropsWithoutRef<typeof Select.Label>
>(({ className, ...props }, ref) => (
    <Select.Label
        ref={ref}
        className={`py-1.5 pl-8 pr-2 text-sm font-semibold ${className}`}
        {...props}
    />
));
SelectLabel.displayName = Select.Label.displayName;

const SelectSeparator = React.forwardRef<
    React.ElementRef<typeof Select.Separator>,
    React.ComponentPropsWithoutRef<typeof Select.Separator>
>(({ className, ...props }, ref) => (
    <Select.Separator
        ref={ref}
        className={`-mx-1 my-1 h-px bg-gray-200 ${className}`}
        {...props}
    />
));
SelectSeparator.displayName = Select.Separator.displayName;

const SelectScrollUpButton = React.forwardRef<
    React.ElementRef<typeof Select.ScrollUpButton>,
    React.ComponentPropsWithoutRef<typeof Select.ScrollUpButton>
>(({ className, ...props }, ref) => (
    <Select.ScrollUpButton
        ref={ref}
        className={`flex cursor-default items-center justify-center py-1 ${className}`}
        {...props}
    >
        <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="m7.14645 3.14645c.19526-.19527.51184-.19527.7071 0l6.99995 6.99995c.1953.1953.1953.5119 0 .7071-.1952.1953-.5118.1953-.7071 0l-6.64645-6.64641-6.646456 6.64641c-.195262.1953-.511845.1953-.707107 0-.195262-.1952-.195262-.5118 0-.7071l6.999997-6.99995z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
            />
        </svg>
    </Select.ScrollUpButton>
));
SelectScrollUpButton.displayName = Select.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
    React.ElementRef<typeof Select.ScrollDownButton>,
    React.ComponentPropsWithoutRef<typeof Select.ScrollDownButton>
>(({ className, ...props }, ref) => (
    <Select.ScrollDownButton
        ref={ref}
        className={`flex cursor-default items-center justify-center py-1 ${className}`}
        {...props}
    >
        <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="m7.14645 11.8536c.19526.1952.51184.1952.7071 0l6.99995-7c.1953-.1952.1953-.5118 0-.7071-.1952-.1952-.5118-.1952-.7071 0l-6.64645 6.6464-6.646456-6.6464c-.195262-.1952-.511845-.1952-.707107 0-.195262.1953-.195262.5119 0 .7071l6.999997 7z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
            />
        </svg>
    </Select.ScrollDownButton>
));
SelectScrollDownButton.displayName = Select.ScrollDownButton.displayName;

export {
    SelectRoot,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectIcon,
    SelectPortal,
    SelectContent,
    SelectViewport,
    SelectItem,
    SelectItemText,
    SelectItemIndicator,
    SelectLabel,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
};

import * as Dialog from "@radix-ui/react-dialog";
import * as React from "react";

const ModalRoot = Dialog.Root;

const ModalTrigger = Dialog.Trigger;

const ModalPortal = Dialog.Portal;

const ModalOverlay = React.forwardRef<
    React.ElementRef<typeof Dialog.Overlay>,
    React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
    <Dialog.Overlay
        ref={ref}
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ${className}`}
        {...props}
    />
));
ModalOverlay.displayName = Dialog.Overlay.displayName;

const ModalContent = React.forwardRef<
    React.ElementRef<typeof Dialog.Content>,
    React.ComponentPropsWithoutRef<typeof Dialog.Content>
>(({ className, children, ...props }, ref) => (
    <ModalPortal>
        <ModalOverlay />
        <Dialog.Content
            ref={ref}
            className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg ${className}`}
            {...props}
        >
            {children}
        </Dialog.Content>
    </ModalPortal>
));
ModalContent.displayName = Dialog.Content.displayName;

const ModalHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}
        {...props}
    />
);
ModalHeader.displayName = "ModalHeader";

const ModalFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}
        {...props}
    />
);
ModalFooter.displayName = "ModalFooter";

const ModalTitle = React.forwardRef<
    React.ElementRef<typeof Dialog.Title>,
    React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
    <Dialog.Title
        ref={ref}
        className={`text-lg font-semibold leading-none tracking-tight ${className}`}
        {...props}
    />
));
ModalTitle.displayName = Dialog.Title.displayName;

const ModalDescription = React.forwardRef<
    React.ElementRef<typeof Dialog.Description>,
    React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
    <Dialog.Description
        ref={ref}
        className={`text-sm text-gray-500 ${className}`}
        {...props}
    />
));
ModalDescription.displayName = Dialog.Description.displayName;

const ModalClose = React.forwardRef<
    React.ElementRef<typeof Dialog.Close>,
    React.ComponentPropsWithoutRef<typeof Dialog.Close>
>(({ className, ...props }, ref) => (
    <Dialog.Close ref={ref} className={className} {...props} />
));
ModalClose.displayName = Dialog.Close.displayName;

export {
    ModalRoot,
    ModalTrigger,
    ModalPortal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalTitle,
    ModalDescription,
    ModalClose,
};
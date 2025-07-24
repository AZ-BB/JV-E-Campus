import { Avatar as AvatarPrimitive } from "radix-ui";
import { cn } from "@/utils/cn";

export default function Avatar({
    src,
    alt,
    fallback,
    delayMs,
    className,
}: {
    src: string;
    alt: string;
    fallback?: string;
    delayMs?: number;
    className?: string;
}) {
    return (
        <AvatarPrimitive.Root className={cn(`inline-flex items-center justify-center overflow-hidden select-none rounded-full bg-admin-surface`)}>
            <AvatarPrimitive.Image src={src} alt={alt} className={cn(`w-full h-full object-cover rounded-full`, className)} />
            <AvatarPrimitive.Fallback delayMs={delayMs || 600} className={cn(`flex items-center justify-center font-semibold text-sm w-full h-full rounded-full text-admin-text border border-admin-border`, className)}>{fallback}</AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>
    )
}




import { Avatar as AvatarPrimitive } from "radix-ui";
import { cn } from "@/utils/cn";

export default function Avatar({
    src,
    alt,
    fallback = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzciIHI9IjEyIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMCA4M2MwLTE2LjU2OSAxMy40MzEtMzAgMzAtMzBzMzAgMTMuNDMxIDMwIDMwdjEwSDIwVjgzWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K",
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




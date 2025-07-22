import { Avatar as AvatarPrimitive } from "@radix-ui/react-avatar";

export default function Avatar({
    ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive>) {
    return <AvatarPrimitive {...props} />
}


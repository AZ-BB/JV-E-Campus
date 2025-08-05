
import { formatDistanceToNow } from 'date-fns'

export default function TimeAgo({ date }: { date: string }) {
    return (
        <time dateTime={date} title={new Date(date).toISOString()}>
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </time>
    )
}

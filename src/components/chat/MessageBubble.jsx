import { clsx } from 'clsx'
import { timeAgo } from '../../utils/formatDate'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * A single chat message bubble. isOwnMessage determines left/right
 * alignment and colour — matches backend's senderId field: if
 * senderId equals the current user's ID, it's "own" (right-aligned,
 * brand colour); if senderId is the literal "ADMIN" (backend Part 20's
 * convention), it's the other party (left-aligned, grey).
 */

export default function MessageBubble({ message, isOwnMessage }) {
  return (
    <div className={clsx('flex mb-3', isOwnMessage ? 'justify-end' : 'justify-start')}>
      <div className={clsx(
        'max-w-[75%] rounded-2xl px-4 py-2.5',
        isOwnMessage
          ? 'bg-[#0078D4] text-white rounded-br-sm'
          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
      )}>
        <p className="text-sm leading-relaxed break-words">{message.message}</p>
        <p className={clsx(
          'text-[10px] mt-1',
          isOwnMessage ? 'text-blue-200' : 'text-gray-400'
        )}>
          {timeAgo(message.createdAt)}
        </p>
      </div>
    </div>
  )
}

import { useNotification } from '../NotificationContext'

const Notification = () => {
  const notification = useNotification()

  if (!notification) {
    return null
  }

  return (
    <div
      style={{
        border: '1px solid',
        color: notification.type === 'error' ? 'red' : 'green',
        padding: 10,
        marginBottom: 10,
      }}
    >
      {notification.message}
    </div>
  )
}

export default Notification

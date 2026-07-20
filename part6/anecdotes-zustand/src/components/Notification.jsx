import { useNotificationStore } from '../notificationStore'

const Notification = () => {
  const message = useNotificationStore((state) => state.message)

  if (!message) {
    return null
  }

  return (
    <div style={{ border: '1px solid', padding: 10, marginBottom: 10 }}>
      {message}
    </div>
  )
}

export default Notification

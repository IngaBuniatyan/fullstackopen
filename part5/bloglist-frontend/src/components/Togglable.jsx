import { forwardRef, useImperativeHandle, useState } from 'react'

const Togglable = forwardRef(({ buttonLabel, children }, refs) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible((currentVisibility) => !currentVisibility)
  }

  useImperativeHandle(refs, () => ({
    toggleVisibility,
  }))

  if (!visible) {
    return (
      <button type="button" onClick={toggleVisibility}>
        {buttonLabel}
      </button>
    )
  }

  return (
    <div>
      {children}
      <button type="button" onClick={toggleVisibility}>
        cancel
      </button>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable

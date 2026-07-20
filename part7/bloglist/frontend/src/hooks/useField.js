import { useState } from 'react'

const useField = (type = 'text') => {
  const [value, setValue] = useState('')

  const onChange = (event) => setValue(event.target.value)
  const reset = () => setValue('')

  return {
    input: { type, value, onChange },
    reset,
    value,
  }
}

export default useField

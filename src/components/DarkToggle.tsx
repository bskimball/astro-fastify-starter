import { useEffect, useState } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa6'
import { Button } from 'react-aria-components'

function getInitialState(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  )
}

export default function DarkToggle() {
  const [isSelected, setIsSelected] = useState(() => getInitialState())

  useEffect(() => {
    setIsSelected(getInitialState())
  }, [])

  useEffect(() => {
    if (isSelected) {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }, [isSelected])

  return (
    <Button onPress={() => setIsSelected(!isSelected)}>
      {isSelected ? <FaMoon /> : <FaSun />}
    </Button>
  )
}

import { Switch } from '@nextui-org/switch'
import { useEffect, useState } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa6'

function getInitialState(): boolean {
  console.log(typeof window)

  if (typeof window === 'undefined') {
    return false
  }

  console.log(localStorage.theme)

  return (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  )
}

export default function DarkToggle() {
  const [isSelected, setIsSelected] = useState<boolean>(getInitialState())

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
    <Switch
      isSelected={isSelected}
      onValueChange={setIsSelected}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <FaMoon className={className} />
        ) : (
          <FaSun className={className} />
        )
      }
    >
      Dark Mode
    </Switch>
  )
}

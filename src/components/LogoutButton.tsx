import { Button } from 'react-aria-components'
import { client } from '@/api/client.ts'
import { navigate } from 'astro:transitions/client'

export default function LogoutButton() {
  return (
    <Button
      onPress={() => client.auth.logout.mutate().then(() => navigate('/login'))}
    >
      Logout
    </Button>
  )
}

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/navbar'
import type { User } from 'lucia'
import { client } from '../api/client.ts'
import { navigate } from 'astro:transitions/client'

type Props = {
  user?: User
}

export default function Navigation({ user }: Props) {
  return (
    <Navbar>
      <NavbarBrand className="flex flex-col">
        <div className="text-3xl font-bold">Fastro</div>
        <p className="font-bold text-inherit">Astro + Fastify Starter</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <a href="/">Home</a>
        </NavbarItem>
        {!user ? (
          <>
            <NavbarItem>
              <a href="/login">Login</a>
            </NavbarItem>
            <NavbarItem>
              <a href="/register">Register</a>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <button
              onClick={() => {
                client.auth.logout.mutate()
                navigate('/login')
              }}
            >
              Logout
            </button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  )
}

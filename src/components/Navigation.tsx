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
  currentPath?: string
}

export default function Navigation({ user, currentPath }: Props) {
  return (
    <Navbar>
      <NavbarBrand className="flex flex-col">
        <div className="text-3xl font-bold">Fastro</div>
        <p className="font-bold text-inherit">Astro + Fastify Starter</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarItem isActive={currentPath === '/'}>
          <a href="/">Home</a>
        </NavbarItem>
        <NavbarItem isActive={currentPath === '/examples'}>
          <a href="/examples">Example</a>
        </NavbarItem>
        {!user ? (
          <>
            <NavbarItem isActive={currentPath === '/login'}>
              <a href="/login">Login</a>
            </NavbarItem>
            <NavbarItem isActive={currentPath === '/register'}>
              <a href="/register">Register</a>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <button
              onClick={() => {
                client.auth.logout.mutate().then(() => navigate('/login'))
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

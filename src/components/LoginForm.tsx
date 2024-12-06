import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Button,
} from 'react-aria-components'
import { client } from '../api/client.ts'
import { useState } from 'react'
import { FaEyeSlash, FaEye, FaRocket } from 'react-icons/fa6'
import { navigate } from 'astro:transitions/client'
import { useFormStatus } from 'react-dom'

function Submit() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="flex items-center gap-2 btn">
      {pending ? 'Submitting' : 'Submit'} <FaRocket />
    </Button>
  )
}

export default function LoginForm() {
  const [visible, setVisible] = useState<boolean>(false)
  const [formError, setFormError] = useState<null | string>('')

  const loginAction = async (formData: FormData) => {
    const result = await client.auth.login.mutate({
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    })
    if (!result.ok) {
      setFormError(result.error)
    } else {
      await navigate(result.redirect)
    }
  }

  return (
    <div>
      {formError ? (
        <div className="p-6 bg-red-200 border border-red-500 text-red-800 rounded-xl my-3 max-w-xs">
          {formError}
        </div>
      ) : null}
      <Form action={loginAction} className="space-y-3 max-w-xs">
        <TextField
          name="username"
          type="text"
          className="flex flex-col"
          autoComplete="username"
          minLength={2}
          isRequired
        >
          <Label>Username</Label>
          <Input />
          <FieldError />
        </TextField>
        <TextField
          name="password"
          type={visible ? 'text' : 'password'}
          className="relative flex flex-col"
          autoComplete="current-password"
          minLength={6}
          isRequired
        >
          <Label>Password</Label>
          <Input />
          <Button
            className="absolute top-0 right-2 text-gray-800 hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-300"
            type="button"
            onPress={() => setVisible(!visible)}
          >
            {visible ? <FaEyeSlash /> : <FaEye />}
          </Button>
          <FieldError />
        </TextField>
        <div>
          <Submit />
        </div>
      </Form>
    </div>
  )
}

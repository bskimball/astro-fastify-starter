import {
  Form,
  Input,
  Button,
  TextField,
  Label,
  FieldError,
} from 'react-aria-components'
import { client } from '../api/client.ts'
import { useState } from 'react'
import { FaEyeSlash, FaEye, FaRocket } from 'react-icons/fa6'
import { navigate } from 'astro:transitions/client'
import { useFormStatus } from 'react-dom'

function Submit() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="flex items-center gap-2 rounded py-2 px-3 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
    >
      {pending ? 'Submitting' : 'Submit'} <FaRocket />
    </Button>
  )
}

export default function RegisterForm() {
  const [visible, setVisible] = useState<boolean>(false)
  const [formError, setFormError] = useState<null | string>(null)

  const registerAction = async (values: FormData) => {
    if (values.get('password') !== values.get('password_again')) {
      setFormError('Passwords do not match')
    } else {
      const result = await client.auth.register.mutate({
        username: values.get('username') as string,
        password: values.get('password') as string,
      })

      if (!result.ok) {
        setFormError(result.error)
      } else {
        await navigate(result.redirect)
      }
    }
  }

  return (
    <div>
      {formError ? (
        <div className="p-6 bg-red-200 border border-red-500 text-red-800 rounded-xl my-3 max-w-xs">
          {formError}
        </div>
      ) : null}
      <Form action={registerAction} className="space-y-3 max-w-xs">
        <TextField
          name="username"
          type="text"
          className="flex flex-col"
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
        <TextField
          name="password_again"
          type={visible ? 'text' : 'password'}
          className="relative flex flex-col"
          minLength={6}
          isRequired
        >
          <Label>Password Again</Label>
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

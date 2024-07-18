import { useForm, Controller } from 'react-hook-form'
import { Form } from 'react-aria-components'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { client, type RouterInput } from '../api/client.ts'
import { useState } from 'react'
import { FaEyeSlash, FaEye } from 'react-icons/fa6'
import { navigate } from 'astro:transitions/client'

const schema = z.object({
  username: z.string().min(3).max(31),
  password: z.string().min(6).max(255),
})

export default function LoginForm() {
  const { handleSubmit, control } = useForm<RouterInput['auth']['login']>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(schema),
  })
  const [visible, setVisible] = useState<boolean>(false)
  const [formError, setFormError] = useState<null | string>('')

  const onSubmit = async (values: RouterInput['auth']['login']) => {
    const result = await client.auth.login.mutate(values)

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
      <Form onSubmit={handleSubmit(onSubmit)} className="space-y-3 max-w-xs">
        <Controller
          control={control}
          name={'username'}
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <Input
              ref={ref}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              validationBehavior="aria"
              isInvalid={invalid}
              label={'Username'}
              className="max-w-xs"
              type={'text'}
              errorMessage={error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name={'password'}
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <Input
              ref={ref}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              isInvalid={invalid}
              label={'Password'}
              className="max-w-xs"
              type={!visible ? 'password' : 'text'}
              endContent={
                <button
                  className="focus:outline-none"
                  onClick={() => setVisible(!visible)}
                  type="button"
                >
                  {visible ? (
                    <FaEye className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              errorMessage={error?.message}
            />
          )}
        />
        <div>
          <Button color="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  )
}

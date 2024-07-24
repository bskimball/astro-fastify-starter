import { useForm, Controller } from 'react-hook-form'
import { Form } from 'react-aria-components'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { client } from '../api/client.ts'
import { useState } from 'react'
import { FaEyeSlash, FaEye, FaPaperPlane } from 'react-icons/fa6'
import { navigate } from 'astro:transitions/client'

const schema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(31)
      .regex(/^[a-z0-9_-]+$/),
    password: z.string().min(6).max(255),
    password_again: z.string().min(6).max(255),
  })
  .superRefine(({ password, password_again }, ctx) => {
    if (password_again !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      })
    }
  })

export default function RegisterForm() {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      username: '',
      password: '',
      password_again: '',
    },
    resolver: zodResolver(schema),
  })
  const [visible, setVisible] = useState<boolean>(false)
  const [formError, setFormError] = useState<null | string>(null)

  const onSubmit = async (values: {
    username: string
    password: string
    password_again?: string
  }) => {
    delete values.password_again
    const result = await client.auth.register.mutate(values)

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
              variant="faded"
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
              variant="faded"
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
        <Controller
          control={control}
          name={'password_again'}
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
              label={'Password Again'}
              className="max-w-xs"
              type={!visible ? 'password' : 'text'}
              variant="faded"
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
            Submit <FaPaperPlane />
          </Button>
        </div>
      </Form>
    </div>
  )
}

'use client'

import axios from 'axios'
import { useRouter } from "next/navigation"
import { signIn, useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from "react-hot-toast"
import { BsGithub, BsGoogle } from 'react-icons/bs'

import Input from '@/app/components/inputs/Input'
import Button from '@/app/components/Button'
import AuthSocialButton from '@/app/(site)/components/AuthSocialButton'

type Variant = 'LOGIN' | 'REGISTER'

function AuthForm() {
  const router = useRouter()
  const session = useSession()

  const [variant, setVariant] = useState<Variant>('LOGIN')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users')
    }
  }, [router, session?.status])

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER')
    } else {
      setVariant('LOGIN')
    }
  }, [variant])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true)

    if (variant === 'REGISTER') {
      try {
        await axios.post('/api/register', data)
        await signIn('credentials', data)
      } catch (error: any) {
        toast.error('Something went wrong')
      } finally {
        setIsLoading(false)
      }
    }

    if (variant === 'LOGIN') {
      try {
        const callback = await signIn('credentials', {
          ...data,
          redirect: false
        })

        if (callback?.error) {
          toast.error('Invalid credentials')
        }

        if (callback?.ok && !callback?.error) {
          router.push('/users')
        }
      } catch {
      } finally {
        setIsLoading(false)
      }
    }
  }

  const socialAction = async (action: string) => {
    setIsLoading(true)

    try {
      const callback = await signIn(action, { redirect: false })

      if (callback?.error) {
        toast.error('Invalid credentials')
      }

      if (callback?.ok && !callback?.error) {
        toast.success('Logged in')
      }
    } catch {
    } finally {
      setIsLoading(false)
    }

  }

  return (
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
      <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              id='name'
              label='Name'
              errors={errors}
              register={register}
              disabled={isLoading}
            />
          )}
          <Input
            id='email'
            label='Email address'
            type='email'
            errors={errors}
            register={register}
            disabled={isLoading}
          />
          <Input
            id='password'
            label='Password'
            type='password'
            errors={errors}
            register={register}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth type='submit'>
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>

        <div className='mt-6'>
          <div className='relative'>
            <div
              className='
                absolute
                inset-0
                flex
                items-center
              '
            >
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-white px-2 text-gray-500'>
                Or continue with
              </span>
            </div>
          </div>

          <div className='mt-6 flex gap-2'>
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>

        <div
          className='
            mt-6
            flex
            justify-center
            gap-2
            px-2
            text-sm
            text-gray-500
          '
        >
          <div>
            {variant === 'LOGIN'
              ? 'New to Messenger?'
              : 'Already have an account?'}
          </div>
          <div onClick={toggleVariant} className='cursor-pointer underline'>
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm

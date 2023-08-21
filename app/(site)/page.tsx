import Image from 'next/image'

import AuthForm from '@/app/(site)/components/AuthForm'

export default function Home() {
  return (
    <div className='flex min-h-full flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <Image
          alt='Logo'
          src='/images/logo.png'
          className='mx-auto w-auto'
          height='48'
          width='48'
        />
        <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
          Sign in to your account
        </h2>
      </div>
      <AuthForm />
    </div>
  )
}

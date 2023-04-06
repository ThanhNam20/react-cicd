import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Input from 'src/components/Input'
import { LoginSchema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { loginAccount } from 'src/services/auth.api'
import { toast } from 'react-toastify'
import { ResponseApi } from 'src/types/utils.type'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import Register from '../Register'

interface LoginDto {
  email: string
  password: string
}

const Login = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors }
  } = useForm<LoginSchema>({
    resolver: yupResolver(schema)
  })
  // const rules = getRules(getValues);

  const loginUser = useMutation({
    mutationFn: (body: LoginSchema) => loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginUser.mutate(data, {
      onSuccess: (response) => {
        console.log(response)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ResponseApi<LoginDto>>(error)) {
          const formError = error.response?.data.data

          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof LoginDto, {
                message: formError[key as keyof LoginDto],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })
  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form onSubmit={onSubmit} className='rounded bg-white p-10 shadow-sm'>
              <div className='text-2xl'>Đăng nhập</div>
              <Input
                className='mt-8'
                name='email'
                placeholder='Email'
                register={register}
                errorMessage={errors.email?.message}
                type='email'
              />
              <Input
                className='mt-2'
                name='password'
                placeholder='Password'
                register={register}
                errorMessage={errors.password?.message}
                type='password'
                autoComplete='on'
              />
              <div className='mt-3'>
                <button
                  type='submit'
                  className=' hover:bg-text-600 w-full cursor-pointer bg-red-500 px-2 py-4 text-center uppercase text-white '
                >
                  Đăng nhập
                </button>
              </div>
              <div className='mt-8'>
                <div className=' flex items-center justify-center text-center text-orange'>
                  <span className='text-slate-400'>Bạn chưa có tài khoản?</span>
                  <Link to='/register'>Đăng ký</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

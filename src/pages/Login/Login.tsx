import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Input from 'src/components/Input'
import { LoginSchema, loginSchema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { loginAccount } from 'src/services/auth.api'
import { toast } from 'react-toastify'
import { ErrorResponse } from 'src/types/utils.type'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import Register from '../Register'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import path from 'src/contants/path'

interface LoginDto {
  email: string
  password: string
}

const Login = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors }
  } = useForm<LoginSchema>({
    resolver: yupResolver(loginSchema)
  })
  
  const loginUserMutation = useMutation({
    mutationFn: (body: LoginSchema) => loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginUserMutation.mutate(data, {
      onSuccess: (response) => {
        setIsAuthenticated(true)
        setProfile(response.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<LoginDto>>(error)) {
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
                <Button
                  isLoading={loginUserMutation.isLoading}
                  disabled={loginUserMutation.isLoading}
                  type='submit'
                  className=' hover:bg-text-600 flex w-full cursor-pointer items-center justify-center bg-red-500 px-2 py-4 text-center uppercase text-white'
                >
                  Đằng nhập
                </Button>
              </div>
              <div className='mt-8'>
                <div className=' flex items-center justify-center text-center text-orange'>
                  <span className='text-slate-400'>Bạn chưa có tài khoản?</span>
                  <Link to={path.register}>Đăng ký</Link>
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

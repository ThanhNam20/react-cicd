import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input'
import { AuthenticationSchema, getRules, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { registerAccount } from 'src/services/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import path from 'src/contants/path'

interface Register {
  email: string
  password: string
  confirm_password: string
}

const Register = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError
  } = useForm<AuthenticationSchema>({
    resolver: yupResolver(schema)
  })
  // const rules = getRules(getValues)
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<AuthenticationSchema, 'confirm_password'>) => registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const registerBody = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(registerBody, {
      onSuccess(data) {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<Register, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data

          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<Register, 'confirm_password'>, {
                message: formError[key as keyof Omit<Register, 'confirm_password'>],
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
              <div className='text-2xl'>Đăng ký</div>
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
              <Input
                className='mt-2'
                name='confirm_password'
                placeholder='Confirm password'
                register={register}
                errorMessage={errors.confirm_password?.message}
                type='password'
                autoComplete='on'
              />
              <div className='mt-3'>
                <Button
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                  type='submit'
                  className=' hover:bg-text-600 flex w-full cursor-pointer items-center justify-center bg-red-500 px-2 py-4 text-center uppercase text-white'
                >
                  Đăng ký
                </Button>
              </div>
              <div className='mt-8'>
                <div className=' flex items-center justify-center text-center text-orange'>
                  <span className='text-slate-400'>Bạn đã có tài khoản?</span>
                  <Link to={path.login}>Đăng nhập</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

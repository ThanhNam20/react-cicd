import { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'

type Rules = { [key in 'email' | 'password' | 'confirm_password']: RegisterOptions }

export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email is required'
    },
    pattern: {
      // eslint-disable-next-line no-useless-escape
      value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      message: 'Email is not valid'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password is required'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Confirm password is required'
    },
    validate:
      typeof getValues === 'function'
        ? (value) => value === getValues('password') || 'Confirm password not the same password.'
        : undefined
  }
})
// Schema tổng
export const schema = yup
  .object({
    email: yup.string().required('Email is required').email('Email is not valid'),
    password: yup.string().required('Password is required'),
    confirm_password: yup.string().oneOf([yup.ref('password')], 'Confirm password must match')
  })
  .required()
// Loại bỏ các trường không dùng đến trong schema
const loginSchema = schema.omit(['confirm_password'])

//Export type cho từng schema nhỏ
export type LoginSchema = yup.InferType<typeof loginSchema>
export type AuthenticationSchema = yup.InferType<typeof schema>

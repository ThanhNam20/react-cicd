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
    confirm_password: yup.string().oneOf([yup.ref('password')], 'Confirm password must match'),
    // Add custom rule in yup
    price_min: yup.string().test({
      name: 'price-not-allowed',
      message: 'Giá không phù hợp',
      test: function (value) {
        const price_min = value
        const { price_max } = this.parent
        if (price_min !== '' && price_max !== '') {
          return Number(price_max) >= Number(price_min)
        }
        return price_min !== '' || price_max
      }
    }),

    price_max: yup.string().test({
      name: 'price-not-allowed',
      message: 'Giá không phù hợp',
      test: function (value) {
        const price_max = value
        const { price_min } = this.parent
        if (price_max !== '' && price_min !== '') {
          return Number(price_max) >= Number(price_min)
        }
        return price_max !== '' || price_min
      }
    })
  })
  .required()

// Loại bỏ các trường không dùng đến trong schema
const loginSchema = schema.omit(['confirm_password'])
export const priceSchema = schema.pick(['price_min', 'price_max'])

//Export type cho từng schema nhỏ
export type LoginSchema = yup.InferType<typeof loginSchema>
export type AuthenticationSchema = yup.InferType<typeof schema>
export type PriceSchema = yup.InferType<typeof priceSchema>

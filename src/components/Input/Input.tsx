import React from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props {
  type: React.HTMLInputTypeAttribute
  errorMessage?: string
  placeholder?: string
  className?: string
  name: string
  register: UseFormRegister<any>
  rules?: RegisterOptions
  autoComplete?: string
}

const Input = ({ autoComplete, type, errorMessage, placeholder, className, name, register, rules }: Props) => {
  return (
    <div className={className}>
      <input
        autoComplete={autoComplete}
        type={type}
        placeholder={placeholder}
        className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
        {...register(name, rules)}
      />
      <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
    </div>
  )
}

export default Input

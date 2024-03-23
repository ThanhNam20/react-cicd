import axios, { AxiosError, HttpStatusCode } from 'axios'
import { ErrorResponse } from 'src/types/utils.type'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosUnauthorizedError<
      ErrorResponse<{
        name: string
        message: string
      }>
    >(error) && error.response?.data?.data?.name === 'EXPIRED_TOKEN'
  )
}

export function formatCurrency(current: number) {
  return new Intl.NumberFormat('de-DE').format(current)
}
export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value)
}

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`
}

export const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-')
  return arr[arr.length - 1]
}

export const rateSale = (original: number, sale: number) => Math.round(((original - sale) / original) * 100) + '%'
export const getAvatarUrl = (image_name?: string) => `https://api-ecom.duthanhduoc.com/images/${image_name}`

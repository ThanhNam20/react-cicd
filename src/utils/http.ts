import axios, { AxiosError, AxiosInstance, HttpStatusCode, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from 'src/services/auth.api'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type'
import { ErrorResponse } from 'src/types/utils.type'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileFromLS,
  setRefreshTokenToLS
} from './auth'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 10,
        'expire-refresh-token': 15
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(this.refreshToken)
          setProfileFromLS(data.data.user)
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
        }
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response
      },
      (error: AxiosError) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        // Chỉ Toast những lỗi không phải 422 và 401

        if (
          error.response &&
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response.status)
        ) {
          const errorResponse: any | undefined = error.response?.data
          const message = errorResponse.message || error.message
          toast.error(message)
        }
        if (
          isAxiosUnauthorizedError<
            ErrorResponse<{
              name: string
              message: string
            }>
          >(error)
        ) {
          // Trường hợp Token hết hạn và request đó không phải là request refesh_token thí chúng ta mới gọi refresh_token
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
          const url = config.url
          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            //refreshTokenRequest dùng để tránh gọi api get access_token
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // Giữ lại refreshTokenRequest trong 10s để những request tiêp theo có thể dùng tiêp
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest
              .then((access_token) => {
                // Đoạn này add lại header và gọi lại request cũ
                if (config.headers) config.headers.Authorization = access_token
                return this.instance(config)
              })
              .catch((error) => {
                throw error
              })
          }
          clearLS()
          this.accessToken = ''
          this.refreshToken = ''
          toast.error(error.response?.data.data?.message || error.response?.data.message)
        }
        return Promise.reject(error)
      }
    )
  }

  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((response) => {
        const { access_token } = response.data.data
        setAccessTokenToLS(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        clearLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

const http = new Http().instance
export default http

export interface BaseResponse<T = any> {
  code: number
  data?: T
  message: string
}

export const success = <T>(data?: T, message = 'success'): BaseResponse<T> => {
  return { code: 0, data, message }
}

export const fail = (code = -1, message = 'error'): BaseResponse => {
  return { code, message }
}

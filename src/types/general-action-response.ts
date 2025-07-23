export interface GeneralActionResponse<T> {
  data: T | null
  error: string | null
  message: string | null
}

import { z } from 'zod'

export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  perPage: z.number().int().positive().max(100),
  total: z.number().int().nonnegative(),
})

export const ErrorResponseSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
})

export type Pagination = z.infer<typeof PaginationSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>

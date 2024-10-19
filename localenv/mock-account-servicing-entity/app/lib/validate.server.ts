import { z } from 'zod'

export const uuidSchema = z.object({
  id: z.string().uuid()
})

export const createAccountSchema = z.object({
  name: z.string().min(1),
  path: z.string().min(1),
  assetId: z.string().uuid(),
  cell: z.string().optional(),
  email: z.string().optional(),
  additionalEmails: z.string().optional()
})

export const updateAccountSchema = z
  .object({
    name: z.string().min(1),
    cell: z.string().optional(),
    email: z.string().optional(),
    additionalEmails: z.string().optional()
  })
  .merge(uuidSchema)

export const addLiquiditySchema = z
  .object({
    amount: z.coerce.number().positive()
  })
  .merge(uuidSchema)

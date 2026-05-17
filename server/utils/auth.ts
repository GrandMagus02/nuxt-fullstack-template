import process from 'node:process'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { db } from './db'

if (!process.env.AUTH_SECRET)
  throw new Error('AUTH_SECRET is required — generate one with: openssl rand -base64 32')

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  database: prismaAdapter(db, { provider: 'postgresql' }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    ...(process.env.AUTH_GOOGLE_CLIENT_ID && process.env.AUTH_GOOGLE_CLIENT_SECRET && {
      google: {
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
      },
    }),

    ...(process.env.AUTH_GITHUB_CLIENT_ID && process.env.AUTH_GITHUB_CLIENT_SECRET && {
      github: {
        clientId: process.env.AUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
      },
    }),
  },
})

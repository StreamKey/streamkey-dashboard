export const isDev = process.env.NODE_ENV.toUpperCase() === 'DEVELOPMENT'
export const isProd = process.env.NODE_ENV.toUpperCase() === 'PRODUCTION'
export const isTest = process.env.NODE_ENV.toUpperCase() === 'TEST'

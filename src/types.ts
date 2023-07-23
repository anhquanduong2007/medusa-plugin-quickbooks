export type QuickBooksPluginOptions = {
    clientId: string
    clientSecret: string
    redirectUri: string
    environment: 'sandbox' | 'production'
    companyId: string
    returnUrl: string
    scope: string[],
    state?: string,
}
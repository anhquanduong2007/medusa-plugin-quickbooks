import { QuickBooksPluginOptions } from "../types"
import { TransactionBaseService, ProductService, ShippingProfileService, ProductStatus } from "@medusajs/medusa"
import OAuthClient from 'intuit-oauth'
import QbRepository from "../repositories/qb"
import { Request } from 'express'
import axios from 'axios'

class QuickBooksService extends TransactionBaseService {
   protected readonly qbRepository: typeof QbRepository
   protected readonly config_: QuickBooksPluginOptions
   protected readonly productService_: ProductService
   protected readonly shippingProfileService_: ShippingProfileService
   protected readonly oauthClient: any

   constructor({ qbRepository, manager, shippingProfileService, productService }, qbOptions: QuickBooksPluginOptions) {
      super({ qbRepository, manager, shippingProfileService, productService }, qbOptions)

      this.qbRepository = qbRepository
      this.manager_ = manager
      this.config_ = qbOptions
      this.productService_ = productService
      this.shippingProfileService_ = shippingProfileService

      const { clientId, clientSecret, environment, redirectUri, companyId } = qbOptions

      // if (!clientId) {
      //     throw new Error("Please provide a valid Client ID")
      // }

      // if (!clientSecret) {
      //     throw new Error("Please provide a valid Client Secret")
      // }

      // if (!environment) {
      //     throw new Error("Please provide Environment")
      // }

      // if (!redirectUri) {
      //     throw new Error("Please provide Redirect Uri")
      // }

      // if (!companyId) {
      //     throw new Error("Please provide Company Id")
      // }

      this.oauthClient = new OAuthClient({
         clientId: 'ABUuCFOummC9NMMH8FHgBAq2wq1Qd9bUgs1oDZO3Y0XkNyAisN',
         clientSecret: 'pqouXirYuAO982CjO7QIiYngLqhx7SuwvuweFp9R',
         environment: 'sandbox',
         redirectUri: 'http://localhost:9000/callback',
      })
   }

   public async saveQbAuth(req: Request) {
      try {
         const qbAuth = await this.oauthClient.createToken(req.url)
         const auth = await qbAuth.getJson()
         const qbRepo = this.manager_.withRepository(this.qbRepository)
         const qbAuthInfo = qbRepo.create({
            access_token: auth.access_token,
            expires_in: auth.expires_in,
            token_type: auth.token_type,
            refresh_token: auth.refresh_token,
            id_token: auth.id_token,
            x_refresh_token_expires_in: auth.x_refresh_token_expires_in
         })
         await qbRepo.save(qbAuthInfo)
         return 'hi'
      } catch (error) {
         console.log(error)
      }
   }

   public async getQbAuthUri() {
      try {
         const authUri = await this.oauthClient.authorizeUri({
            scope: [
               OAuthClient.scopes.Accounting,
               OAuthClient.scopes.OpenId,
               OAuthClient.scopes.Profile,
               OAuthClient.scopes.Email,
               OAuthClient.scopes.Phone,
               OAuthClient.scopes.Address
            ],
            state: 'intuit',
         })
         return authUri
      } catch (error) {
         console.log(error)
      }
   }

   public async qbProducts() {
      try {
         const accessToken = await this.getQbAccessToken()
         const url = `https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365318682770/query?minorversion=65`
         const query = 'select * from Item'
         const config = {
            headers: {
               "Authorization": `Bearer ${accessToken}`,
               "Content-Type": `application/text`,
               "Accept": 'application/json'
            }
         }
         const products = await axios.post(url, query, config)
         return products.data.QueryResponse
      } catch (error) {
         console.log(error)
      }
   }

   private async getQbAccessToken() {
      try {
         const qbRepo = this.manager_.withRepository(this.qbRepository)
         const qbAuth = await qbRepo.find({
            order: {
               created_at: 'DESC'
            },
         })
         const expiry = new Date(qbAuth[0].created_at).getTime() + qbAuth[0].expires_in
         const now = Date.now() / 1000;
         if (now < expiry) {
            const newQbAuth = await this.oauthClient.refreshUsingToken(qbAuth[0].refresh_token)
            const auth = newQbAuth.getJson()
            await qbRepo.update(qbAuth[0].id, {
               access_token: auth.access_token,
               expires_in: auth.expires_in,
               token_type: auth.token_type,
               refresh_token: auth.refresh_token,
               id_token: auth.id_token,
               x_refresh_token_expires_in: auth.x_refresh_token_expires_in
            })
            const updatedQbAuth = await qbRepo.findOne({
               where: {
                  id: qbAuth[0].id
               }
            })
            return updatedQbAuth.access_token
         }
      } catch (error) {
         console.log(error)
      }
   }

   public async createProductsMedusa() {
      try {
         const [shippingProfile, _] = await Promise.all([
            this.shippingProfileService_.createDefault(),
            this.shippingProfileService_.createGiftCardDefault()
         ])
         const qbProducts = await this.qbProducts()
         const mapping = []
         qbProducts.Item.forEach((product) => {
            const productCreate = {
               "id": product.Id,
               "title": product.Name,
               "subtitle": null,
               "status": ProductStatus.PUBLISHED,
               "description": product.Description,
               "handle": 'handle_' + product.Id,
               "is_giftcard": false,
               "profile_id": shippingProfile.id,
               "images": ["https://loremflickr.com/320/240?random=" + product.Id],
               "options": [],
               "variants": []
            }
            mapping.push(productCreate)
         })
         for (const product of mapping) {
            await this.productService_.create(product)
         }
         return {
            success: true
         }
      } catch (error) {
         console.log(error)
      }
   }

   public async isQbAuth() {
      try {
         const qbRepo = this.manager_.withRepository(this.qbRepository)
         const qbAuth = await qbRepo.find({
            order: {
               created_at: 'DESC'
            },
         })
         if (qbAuth) {
            return {
               isAuth: true
            }
         }
         return {
            isAuth: false
         }
      } catch (error) {
         console.log(error)
      }
   }
}
export default QuickBooksService
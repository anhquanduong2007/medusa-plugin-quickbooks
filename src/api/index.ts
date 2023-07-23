import { Router } from "express"
import cors from "cors"
import { ConfigModule } from "@medusajs/medusa/dist/types/global"
import { getConfigFile, } from "medusa-core-utils"
export default (rootDirectory) => {
    const router = Router()
    const { configModule } = getConfigFile<ConfigModule>(rootDirectory, "medusa-config")
    const { projectConfig } = configModule

    const corsOptions = {
        origin: projectConfig.admin_cors.split(","),
        credentials: true,
    }

    router.get("/authUri", async (req, res) => {
        const quickBooksService = req.scope.resolve("quickBooksService")
        res.redirect(await quickBooksService.getQbAuthUri());
    });

    router.get('/callback', async function (req, res) {
        const quickBooksService = req.scope.resolve("quickBooksService")
        res.send(await quickBooksService.saveQbAuth(req))
    });

    router.get('/qbProducts', async function (req, res) {
        const quickBooksService = req.scope.resolve("quickBooksService")
        res.json(await quickBooksService.qbProducts())
    });

    router.get('/isQbAuth', cors(corsOptions), async function (req, res) {
        const quickBooksService = req.scope.resolve("quickBooksService")
        res.json(await quickBooksService.isQbAuth())
    });

    router.get('/sync', cors(corsOptions), async function (req, res) {
        const quickBooksService = req.scope.resolve("quickBooksService")
        res.json(await quickBooksService.createProductsMedusa())
    });

    return router
}
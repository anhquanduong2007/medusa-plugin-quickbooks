import { dataSource} from "@medusajs/medusa/dist/loaders/database"
import { QbAuth } from "../models/qbAuth"

export const QbRepository = dataSource.getRepository(QbAuth)

export default QbRepository
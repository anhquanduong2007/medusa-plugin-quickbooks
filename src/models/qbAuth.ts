import { Column, Entity, BeforeInsert } from "typeorm"
import { BaseEntity } from "@medusajs/medusa"
import { generateEntityId } from "@medusajs/medusa/dist/utils"

@Entity()
export class QbAuth extends BaseEntity {
    @Column({ type: "int" })
    x_refresh_token_expires_in: number

    @Column({ type: "varchar" })
    refresh_token: string

    @Column({ type: "varchar" })
    id_token: string

    @Column({ type: "varchar" })
    access_token: string

    @Column({ type: "varchar" })
    token_type: string

    @Column({ type: "int" })
    expires_in: number

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "qb_auth")
    }
}
import { User } from "../../users/entities/user.entity";
import { Column, Entity, Generated, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";


@Entity()
export class Upload {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ unique: true })
    @Generated('uuid')
    uuid: string;

    @Column()
    filename: string;

    @CreateDateColumn({
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.uploads, {
        nullable: true,
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    user: User;
}

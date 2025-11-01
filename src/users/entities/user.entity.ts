import { Exclude } from "class-transformer";
import { Upload } from "../../uploads/entities/upload.entity";
import { Column, Entity, Generated, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Column({ nullable: true })
    passwordResetToken: string;

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

    @OneToMany(() => Upload, (upload) => upload.user, {
        onDelete: 'CASCADE',
    })
    uploads: Upload[];
}

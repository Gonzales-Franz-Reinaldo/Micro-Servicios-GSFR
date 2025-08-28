import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id;

    @Column()
    nombre;

    @Column()
    correoElectronico;

    @CreateDateColumn()
    fechaRegistro;
}
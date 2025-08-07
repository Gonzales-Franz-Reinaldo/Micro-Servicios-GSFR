import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('agenda')
export class Agenda {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 100 })
    nombres!: string;

    @Column({ type: 'varchar', length: 100 })
    apellidos!: string;

    @Column({ type: 'date' })
    fecha_nacimiento!: Date;

    @Column({ type: 'varchar', length: 255 })
    direccion!: string;

    @Column({ type: 'varchar', length: 20 })
    celular!: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    correo!: string;

    @CreateDateColumn()
    created_at!: Date;
}
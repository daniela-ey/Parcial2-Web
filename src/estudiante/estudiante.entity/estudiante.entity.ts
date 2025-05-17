
import { ActividadEntity } from '../../actividad/actividad.entity/actividad.entity';
import { ResenaEntity } from '../../resena/resena.entity/resena.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EstudianteEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 cedula: number;
 
 @Column()
 nombre: string;
 
 @Column()
 correo: string;
 
 @Column()
 programa: string;

 @Column()
 semestre: number;

 @ManyToMany(() => ActividadEntity, actividad => actividad.estudiantes)
 @JoinTable()
    actividades: ActividadEntity[];

@OneToMany(() => ResenaEntity, resena => resena.estudiante)
resenas: ResenaEntity[];


 
}

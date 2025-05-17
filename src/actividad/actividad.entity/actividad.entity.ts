import { EstudianteEntity } from "../../estudiante/estudiante.entity/estudiante.entity";
import { ResenaEntity } from "../../resena/resena.entity/resena.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ActividadEntity {
    @PrimaryGeneratedColumn('uuid')
     id: string;
    
     @Column()
     titulo: string;
     
     @Column()
     fecha: string;
     
     @Column()
     cupoMaximo: number;
    
     @Column()
     estado: string;

     @ManyToMany(() => EstudianteEntity, estudiante => estudiante.actividades)
        estudiantes: EstudianteEntity[];

    @OneToMany(() => ResenaEntity, resena => resena.actividad)
        resenas: ResenaEntity[];

    

  
}

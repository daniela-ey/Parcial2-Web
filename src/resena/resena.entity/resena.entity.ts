import { ActividadEntity } from "../../actividad/actividad.entity/actividad.entity";
import { EstudianteEntity } from "../../estudiante/estudiante.entity/estudiante.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ResenaEntity {
     @PrimaryGeneratedColumn('uuid')
         id: string;
        
         @Column()
         comentario: string;

         @Column()
         calificacion: string;
         
         @Column()
         fecha: string;
         
        @ManyToOne(() => ActividadEntity, actividad => actividad.resenas)
        actividad: ActividadEntity;

        @ManyToOne(() => EstudianteEntity, estudiante => estudiante.resenas)
        estudiante: EstudianteEntity;
            
           
}

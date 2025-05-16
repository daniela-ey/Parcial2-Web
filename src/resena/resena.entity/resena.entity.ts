import { ActividadEntity } from "src/actividad/actividad.entity/actividad.entity";
import { EstudianteEntity } from "src/estudiante/estudiante.entity/estudiante.entity";
import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

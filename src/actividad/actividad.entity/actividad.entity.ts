import { EstudianteEntity } from "src/estudiante/estudiante.entity/estudiante.entity";
import { ResenaEntity } from "src/resena/resena.entity/resena.entity";
import { Column, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

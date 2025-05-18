import { Module } from '@nestjs/common';
import { ResenaService } from './resena.service';
import { ResenaController } from './resena.controller';
import { ResenaEntity } from './resena.entity/resena.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadEntity } from '../actividad/actividad.entity/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity/estudiante.entity';

@Module({
   imports: [TypeOrmModule.forFeature([ResenaEntity, ActividadEntity, EstudianteEntity])],
  providers: [ResenaService],
  controllers: [ResenaController]
})
export class ResenaModule {}

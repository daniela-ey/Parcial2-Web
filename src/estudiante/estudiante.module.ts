import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteController } from './estudiante.controller';
import { ActividadEntity } from 'src/actividad/actividad.entity/actividad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EstudianteEntity, ActividadEntity])],
  providers: [EstudianteService],
  controllers: [EstudianteController]
})
export class EstudianteModule {}

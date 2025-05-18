import { Module } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadController } from './actividad.controller';
import { ActividadEntity } from './actividad.entity/actividad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ActividadEntity])],
  providers: [ActividadService],
  controllers: [ActividadController]
})
export class ActividadModule {}

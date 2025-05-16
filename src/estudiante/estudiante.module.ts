import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EstudianteEntity])],
  providers: [EstudianteService]
})
export class EstudianteModule {}

import { Body, Controller, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { EstudianteDto } from './estudiante.dto/estudiante.dto';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { EstudianteService } from './estudiante.service';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('estudiante')
export class EstudianteController {

     constructor(private readonly estudianteService: EstudianteService) {}

@Post()
 async crearEstudiante(@Body() estudianteDto: EstudianteDto) {

  const estudiante: EstudianteEntity = plainToInstance(EstudianteEntity, estudianteDto);
  return await this.estudianteService.crearEstudiante(estudiante);
   
 }

@Get(':estudianteId')
  async findOne(@Param(':estudianteId') estudianteId: string) {
    return await this.estudianteService.findEstudianteById(estudianteId);
  }

@Put(':estudianteId/inscribirActividad/:actividadId')
  async InscribirseActividad(@Param('estudianteId') estudianteId: string, @Param('actividadId') actividadId: string) {
    return await this.estudianteService.inscribirseActividad(estudianteId, actividadId);
  }

 
}



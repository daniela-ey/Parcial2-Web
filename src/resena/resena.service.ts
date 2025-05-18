import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResenaEntity } from './resena.entity/resena.entity';
import { Repository } from 'typeorm';
import { ActividadEntity } from 'src/actividad/actividad.entity/actividad.entity';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity/estudiante.entity';

@Injectable()
export class ResenaService {
    constructor(
        @InjectRepository(ResenaEntity)
        private readonly resenaRepositorio: Repository<ResenaEntity>,

        @InjectRepository(ActividadEntity)
        private readonly actividadRepositorio: Repository<ActividadEntity>,

        @InjectRepository(EstudianteEntity)
        private readonly estudianteRepositorio: Repository<EstudianteEntity>,
      ) {}

      async agregarResena(resena: ResenaEntity): Promise<ResenaEntity> {
  const actividad = await this.actividadRepositorio.findOne({
    where: { id: resena.actividad.id },
    relations: ['estudiantes'],
  });

  const estudiante = await this.estudianteRepositorio.findOne({
    where: { id: resena.estudiante.id },
  });

  if (!actividad) {
    throw new Error('Actividad no encontrada');
  }

  if (!estudiante) {
    throw new Error('Estudiante no encontrado');
  }

  if (actividad.estado !== '2') {
    throw new Error('La actividad no ha finalizado');
  }

  const estaInscrito = actividad.estudiantes.some(e => e.id === estudiante.id);
  if (!estaInscrito) {
    throw new Error('El estudiante no está inscrito en la actividad');
  }

  // Asociar entidades completas antes de guardar
  resena.actividad = actividad;
  resena.estudiante = estudiante;

  return await this.resenaRepositorio.save(resena);
}
}

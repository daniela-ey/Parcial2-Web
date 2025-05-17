import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity/actividad.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,

    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  async crearEstudiante(estudiante: EstudianteEntity): Promise<EstudianteEntity> {
    const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!valido.test(estudiante.correo)) {
      throw new Error('El correo no es válido');
    }

    if (estudiante.semestre < 1 || estudiante.semestre > 10) {
      throw new Error('El semestre debe estar entre 1 y 10');
    }

    return await this.estudianteRepository.save(estudiante);
  }

 async findEstudianteById(id: string): Promise<EstudianteEntity> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['actividades', 'resenas'],
    });

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    return estudiante;
  }

  async inscribirseActividad(idEstudiante: string, idActividad: string): Promise<EstudianteEntity> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: idEstudiante },
      relations: ['actividades'],
    });

    if (!estudiante) {
      throw new Error('Estudiante no encontrado');
    }

    const actividad = await this.actividadRepository.findOne({
      where: { id: idActividad },
      relations: ['estudiantes'],
    });

    if (!actividad) {
      throw new Error('Actividad no encontrada');
    }

    if (actividad.estado !== '0') {
      throw new Error('La actividad no está abierta para inscripción');
    }

    const yaInscrito = estudiante.actividades.some(a => a.id === actividad.id);
    if (yaInscrito) {
      throw new Error('El estudiante ya está inscrito en esta actividad');
    }

    estudiante.actividades.push(actividad);
    return await this.estudianteRepository.save(estudiante);
  }
}



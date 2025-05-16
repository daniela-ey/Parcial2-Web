import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActividadEntity } from './actividad.entity/actividad.entity';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(ActividadEntity)
    private readonly actividadRepositorio: Repository<ActividadEntity>,
  ) {}

  async crearActividad(actividad: ActividadEntity): Promise<ActividadEntity> {
    const tituloValido = /^[a-zA-Z0-9\s]+$/;

    if (actividad.titulo.length < 15) {
      throw new Error('El título debe tener al menos 15 caracteres');
    }

    if (!tituloValido.test(actividad.titulo)) {
      throw new Error('El título no debe contener símbolos especiales');
    }

    if (actividad.cupoMaximo < 1) {
      throw new Error('El cupo máximo debe ser mayor a 0');
    }

    actividad.estado = '0'; 

    return await this.actividadRepositorio.save(actividad);
  }

  async cambiarEstado(actividadId: string, nuevoEstado: string): Promise<ActividadEntity> {
    const actividad = await this.actividadRepositorio.findOne({
      where: { id: actividadId },
      relations: ['estudiantes'],
    });

    if (!actividad) {
      throw new Error('Actividad no encontrada');
    }

    const inscritos = actividad.estudiantes.length;
    const cupo = actividad.cupoMaximo;
    

    switch (nuevoEstado) {
      case '1': 
        if (inscritos < cupo * 0.8) {
          throw new Error('La actividad solo puede cerrarse si al menos el 80% del cupo está lleno');
        }
        break;

      case '2': 
        if (inscritos < cupo) {
          throw new Error('La actividad solo puede finalizarse si el cupo está completamente lleno');
        }
        break;

      case '0': 
        break;

      default:
        throw new Error('El estado debe ser 0 (abierta), 1 (cerrada) o 2 (finalizada)');
    }

    actividad.estado = nuevoEstado;
    return await this.actividadRepositorio.save(actividad);
  }

  async findAllActividadesByDate(fecha: string): Promise<ActividadEntity[]> {
    const actividades = await this.actividadRepositorio.find({
      where: { fecha },
      relations: ['estudiantes', 'resenas'],
    });

    if (actividades.length === 0) {
      throw new Error('No hay actividades para esta fecha');
    }

    return actividades;
  }
}


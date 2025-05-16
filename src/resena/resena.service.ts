import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResenaEntity } from './resena.entity/resena.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResenaService {
    constructor(
        @InjectRepository(ResenaEntity)
        private readonly actividadRepositorio: Repository<ResenaEntity>,
      ) {}

      async agregarResena(resena: ResenaEntity): Promise<ResenaEntity> {

        if (resena.actividad.estado !== '2') {
            throw new Error('La actividad no ha finalizado');
        }

        if (resena.actividad.estudiantes.includes(resena.estudiante)) {
            throw new Error('El estudiante no está inscrito en la actividad');
        }

        return await this.actividadRepositorio.save(resena);}
}

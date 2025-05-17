/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from '../../estudiante/estudiante.entity/estudiante.entity';
import { ActividadEntity } from '../../actividad/actividad.entity/actividad.entity';
import { ResenaEntity } from '../../resena/resena.entity/resena.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      EstudianteEntity,
      ActividadEntity,
      ResenaEntity,
    ],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([
    EstudianteEntity,
    ActividadEntity,
    ResenaEntity,
  ]),
];

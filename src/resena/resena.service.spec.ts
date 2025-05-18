import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/testing-config';
import { ResenaEntity } from './resena.entity/resena.entity';
import { ResenaService } from './resena.service';
import { EstudianteEntity } from '../estudiante/estudiante.entity/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity/actividad.entity';
import { faker } from '@faker-js/faker';

describe('ResenaService', () => {
  let service: ResenaService;
  let resenaRepository: Repository<ResenaEntity>;
  let estudianteRepository: Repository<EstudianteEntity>;
  let actividadRepository: Repository<ActividadEntity>;

  let estudiante: EstudianteEntity;
  let actividadFinalizada: ActividadEntity;
  let actividadNoFinalizada: ActividadEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ResenaService],
    }).compile();

    service = module.get<ResenaService>(ResenaService);
    resenaRepository = module.get<Repository<ResenaEntity>>(getRepositoryToken(ResenaEntity));
    estudianteRepository = module.get<Repository<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
    actividadRepository = module.get<Repository<ActividadEntity>>(getRepositoryToken(ActividadEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await resenaRepository.clear();
    await estudianteRepository.clear();
    await actividadRepository.clear();

    actividadFinalizada = await actividadRepository.save({
      titulo: faker.lorem.sentence(),
      fecha: faker.date.recent().toISOString().split('T')[0],
      cupoMaximo: 10,
      estado: '2',
      estudiantes: [],
      resenas: [],
    });

    actividadNoFinalizada = await actividadRepository.save({
      titulo: faker.lorem.sentence(),
      fecha: faker.date.recent().toISOString().split('T')[0],
      cupoMaximo: 10,
      estado: '1',
      estudiantes: [],
      resenas: [],
    });

    estudiante = await estudianteRepository.save({
      cedula: faker.number.int(),
      nombre: faker.person.fullName(),
      correo: faker.internet.email(),
      programa: 'Ingeniería',
      semestre: 5,
      actividades: [actividadFinalizada],
      resenas: [],
    });

    actividadFinalizada.estudiantes = [estudiante];
    await actividadRepository.save(actividadFinalizada);
  };

  it('agregarResena debe agregar una reseña válida', async () => {
    const nueva = new ResenaEntity();
    nueva.comentario = 'Excelente experiencia';
    nueva.calificacion = '5';
    nueva.fecha = new Date().toISOString();
    nueva.actividad = actividadFinalizada;
    nueva.estudiante = estudiante;

    const result = await service.agregarResena(nueva);

    expect(result).not.toBeNull();
    expect(result.comentario).toEqual(nueva.comentario);
  });

  it('agregarResena debe fallar si la actividad no está finalizada', async () => {
    const nueva = new ResenaEntity();
    nueva.comentario = 'Muy buena';
    nueva.calificacion = '4';
    nueva.fecha = new Date().toISOString();
    nueva.actividad = actividadNoFinalizada;
    nueva.estudiante = estudiante;

    await expect(() => service.agregarResena(nueva)).rejects.toThrow('La actividad no ha finalizado');
  });

  it('agregarResena debe fallar si el estudiante no está inscrito en la actividad', async () => {
    const otroEstudiante = await estudianteRepository.save({
      cedula: faker.number.int(),
      nombre: faker.person.fullName(),
      correo: faker.internet.email(),
      programa: 'Derecho',
      semestre: 3,
      actividades: [],
      resenas: [],
    });

    const nueva = new ResenaEntity();
    nueva.comentario = 'Regular';
    nueva.calificacion = '3';
    nueva.fecha = new Date().toISOString();
    nueva.actividad = actividadFinalizada;
    nueva.estudiante = otroEstudiante;

    await expect(() => service.agregarResena(nueva)).rejects.toThrow('El estudiante no está inscrito en la actividad');
  });
});


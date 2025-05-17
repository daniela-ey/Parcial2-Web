/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/testing-config';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity/actividad.entity';
import { EstudianteService } from './estudiante.service';
import { faker } from '@faker-js/faker';


describe('EstudianteService', () => {
  let service: EstudianteService;
  let estudianteRepository: Repository<EstudianteEntity>;
  let actividadRepository: Repository<ActividadEntity>;
  let actividadesList: ActividadEntity[];
  let estudiantesList: EstudianteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    estudianteRepository = module.get<Repository<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
    actividadRepository = module.get<Repository<ActividadEntity>>(getRepositoryToken(ActividadEntity));

    await seedDatabase();

  });

  const seedDatabase = async () => {
  await estudianteRepository.clear();
  await actividadRepository.clear();

  estudiantesList = [];
  actividadesList = [];


  for (let i = 0; i < 5; i++) {
    const actividad = await actividadRepository.save(
      actividadRepository.create({
        titulo: faker.lorem.sentence(),
        fecha: faker.date.future().toISOString().split('T')[0], // fecha legible YYYY-MM-DD
        cupoMaximo: faker.number.int({ min: 1, max: 10 }),
        estado: '0',
      })
    );
    actividadesList.push(actividad);
  }


  for (let i = 0; i < 5; i++) {
    const estudiante = await estudianteRepository.save(
      estudianteRepository.create({
        cedula: faker.number.int(),
        nombre: faker.person.fullName(),
        correo: faker.internet.email(),
        programa: faker.helpers.arrayElement(['Ingeniería', 'Derecho', 'Medicina']),
        semestre: faker.number.int({ min: 1, max: 10 }),
        actividades: [actividadesList[0]],
        resenas: [],
      })
    );
    estudiantesList.push(estudiante);
  }
};


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findEstudianteById debe retornar un estudiante por id', async () => {
    const stored = estudiantesList[0];
    const result = await service.findEstudianteById(stored.id);
    expect(result).not.toBeNull();
    expect(result.nombre).toEqual(stored.nombre);
    expect(result.correo).toEqual(stored.correo);
  });

  it('findEstudianteById debe lanzar excepción si no existe', async () => {
    await expect(() => service.findEstudianteById('0')).rejects.toHaveProperty('message', 'Estudiante no encontrado');
  });

  it('crearEstudiante debe crear un estudiante válido', async () => {
    const nuevo = {
      id: '123456',
      cedula: 12345,
      nombre: 'Lucía Martínez',
      correo: 'lucia@example.com',
      programa: 'Ingeniería',
      semestre: 7,
      actividades: [],
      resenas: [],
    };
    const result = await service.crearEstudiante(nuevo as EstudianteEntity);
    expect(result).not.toBeNull();

    const stored = await estudianteRepository.findOne({ where: { id: result.id } });
    expect(stored).not.toBeNull();
    expect(stored?.nombre).toEqual('Lucía Martínez');
  });

  it('crearEstudiante debe lanzar error si el correo es inválido', async () => {
    const invalido = {
      id: '123456',
      cedula: 12345,
      nombre: 'Carlos',
      correo: 'correo-sin-arroba',
      programa: 'Derecho',
      semestre: 5,
      actividades: [],
      resenas: [],
    };
    await expect(() => service.crearEstudiante(invalido as EstudianteEntity)).rejects.toThrow('El correo no es válido');
  });

  it('inscribirseActividad debe inscribir al estudiante a una actividad abierta', async () => {
    const actividad = await actividadRepository.save({
      titulo: 'Taller práctico de NestJS',
      fecha: '2025-05-20',
      cupoMaximo: 5,
      estado: '0',
      estudiantes: [],
      resenas: [],
    });

    const estudiante = estudiantesList[0];
    const result = await service.inscribirseActividad(estudiante.id, actividad.id);
    expect(result.actividades).toHaveLength(2);
    expect(result.actividades[1].id).toEqual(actividad.id);
  });

  it('inscribirseActividad debe lanzar error si la actividad está cerrada', async () => {
    const actividad = await actividadRepository.save({
      titulo: 'Charla cerrada',
      fecha: '2025-06-01',
      cupoMaximo: 10,
      estado: '1',
      estudiantes: [],
      resenas: [],
    });

    const estudiante = estudiantesList[0];
    await expect(() => service.inscribirseActividad(estudiante.id, actividad.id)).rejects.toThrow('La actividad no está abierta para inscripción');
  });

  it('inscribirseActividad debe lanzar error si ya está inscrito', async () => {
    const actividad = await actividadRepository.save({
      titulo: 'Curso de repetición',
      fecha: '2025-07-01',
      cupoMaximo: 10,
      estado: '0',
      estudiantes: [],
      resenas: [],
    });

    const estudiante = estudiantesList[0];
    estudiante.actividades.push(actividad);
    await estudianteRepository.save(estudiante);

    await expect(() => service.inscribirseActividad(estudiante.id, actividad.id)).rejects.toThrow('El estudiante ya está inscrito en esta actividad');
  });
});

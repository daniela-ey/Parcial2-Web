import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActividadService } from './actividad.service';
import { ActividadEntity } from './actividad.entity/actividad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/testing-config';
import { EstudianteEntity } from '../estudiante/estudiante.entity/estudiante.entity';
import { faker } from '@faker-js/faker/.';


describe('ActividadService', () => {
  let service: ActividadService;
  let actividadRepository: Repository<ActividadEntity>;
  let estudiantesList: EstudianteEntity[];
  let estudianteRepository: Repository<EstudianteEntity>;
  let actividadesList: ActividadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActividadService],
    }).compile();

    service = module.get<ActividadService>(ActividadService);
    actividadRepository = module.get<Repository<ActividadEntity>>(getRepositoryToken(ActividadEntity));
    estudianteRepository = module.get<Repository<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await actividadRepository.clear();
    actividadesList = [];
    for (let i = 0; i < 5; i++) {
      const actividad = await actividadRepository.save(
        actividadRepository.create({
          titulo: `Taller ${i + 1} de NestJS`,
          fecha: `2025-05-${10 + i}`,
          cupoMaximo: 10,
          estado: '0',
          estudiantes: [],
          resenas: [],
        })
      );
      actividadesList.push(actividad);
    }

    estudiantesList  = [];

    for (let i = 0; i < 9; i++) {
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

  it('crearActividad debe crear una actividad válida', async () => {
    const nueva = actividadRepository.create({
      titulo: 'Curso practico de programacion web',
      fecha: '2025-06-15',
      cupoMaximo: 15,
      estado: '0',
    });
    const result = await service.crearActividad(nueva);
    expect(result).not.toBeNull();
    expect(result.titulo).toEqual('Curso practico de programacion web');
  });

  it('crearActividad debe lanzar error si el título es muy corto', async () => {
    const actividad = actividadRepository.create({
      titulo: 'Corto',
      fecha: '2025-06-01',
      cupoMaximo: 10,
      estado: '0',
    });
    await expect(() => service.crearActividad(actividad)).rejects.toThrow('El título debe tener al menos 15 caracteres');
  });

  it('crearActividad debe lanzar error si el título tiene símbolos', async () => {
    const actividad = actividadRepository.create({
      titulo: 'Curso * avanzado!',
      fecha: '2025-06-01',
      cupoMaximo: 10,
      estado: '0',
    });
    await expect(() => service.crearActividad(actividad)).rejects.toThrow('El título no debe contener símbolos especiales');
  });

  it('cambiarEstado debe cambiar correctamente a cerrado (1) si el cupo está cubierto al 80%', async () => {
    const actividad = actividadesList[0];
    actividad.estudiantes = estudiantesList.slice(0, 8); 
    await actividadRepository.save(actividad);

    const result = await service.cambiarEstado(actividad.id, '1');
    expect(result.estado).toEqual('1');
  });

  it('cambiarEstado debe lanzar error si no hay suficientes inscritos para cerrar', async () => {
    const actividad = actividadesList[1];
    actividad.estudiantes =estudiantesList.slice(0, 5); 
    await actividadRepository.save(actividad);

    await expect(() => service.cambiarEstado(actividad.id, '1')).rejects.toThrow('La actividad solo puede cerrarse si al menos el 80% del cupo está lleno');
  });

  it('cambiarEstado debe lanzar error si el estado es inválido', async () => {
    const actividad = actividadesList[2];
    await expect(() => service.cambiarEstado(actividad.id, 'X')).rejects.toThrow('El estado debe ser 0, 1 o 2');
  });

  it('findAllActividadesByDate debe retornar actividades para la fecha dada', async () => {
    const fecha = actividadesList[0].fecha;
    const result = await service.findAllActividadesByDate(fecha);
    expect(result).not.toBeNull();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].fecha).toEqual(fecha);
  });

  it('findAllActividadesByDate debe lanzar error si no hay actividades', async () => {
    await expect(() => service.findAllActividadesByDate('2099-01-01')).rejects.toThrow('No hay actividades para esta fecha');
  });
});


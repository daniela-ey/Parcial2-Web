import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ActividadModule } from './actividad/actividad.module';
import { ResenaModule } from './resena/resena.module';
import { EstudianteEntity } from './estudiante/estudiante.entity/estudiante.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenaEntity } from './resena/resena.entity/resena.entity';
import { ActividadEntity } from './actividad/actividad.entity/actividad.entity';

@Module({
  imports: [EstudianteModule, ActividadModule, ResenaModule,
   TypeOrmModule.forRoot({
     type: 'postgres',
     host: 'localhost',
     port: 5432,
     username: 'postgres',
     password: 'postgres',
     database: 'estudiante',
     entities: [EstudianteEntity,ResenaEntity, ActividadEntity],
     dropSchema: true,
     synchronize: true,
    
   }),
   TypeOrmModule.forFeature([EstudianteEntity, ActividadEntity, ResenaEntity])
 ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}

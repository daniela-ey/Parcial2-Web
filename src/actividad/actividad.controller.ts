import { Body, Controller, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { ActividadService } from './actividad.service';
import { plainToInstance } from 'class-transformer';
import { ActividadEntity } from './actividad.entity/actividad.entity';
import { ActividadDto } from './actividad.dto/actividad.dto';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('actividad')
export class ActividadController {

     constructor(private readonly actividadService: ActividadService) {}

     @Post()
        async crearActividad(@Body() actividadDto: ActividadDto) {
        const actividad: ActividadEntity = plainToInstance(ActividadEntity, actividadDto);
        return await this.actividadService.crearActividad(actividad);
        }

     @Put(':ActividadId/estado/:estado')
        async cambiarEstado(@Param('ActividadId') actividadId: string, @Param('estado') estado: string) {
        return await this.actividadService.cambiarEstado(actividadId, estado);
        }

      @Get('fecha')
        async findAllActividadesByDate( @Query('fecha') fecha: string): Promise<ActividadEntity[]> {
        return await this.actividadService.findAllActividadesByDate(fecha);
    }

}

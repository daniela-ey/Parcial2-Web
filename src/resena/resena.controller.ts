import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { ResenaService } from './resena.service';
import { ResenaEntity } from './resena.entity/resena.entity';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('resena')
export class ResenaController {
    constructor(private readonly resenaService: ResenaService) {}

    @Post()
    async agregarResena(@Body() resenaDto: ResenaEntity) {
        const resena: ResenaEntity = plainToInstance(ResenaEntity, resenaDto);
        return await this.resenaService.agregarResena(resena);
    }

}

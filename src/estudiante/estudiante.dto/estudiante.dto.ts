import { IsEmail, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class EstudianteDto {
  @IsNumber()
  @Min(1)
  cedula: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsString()
  @IsNotEmpty()
  programa: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  semestre: number;
}


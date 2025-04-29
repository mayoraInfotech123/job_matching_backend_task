import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class JobResponseDto {
  id: number;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

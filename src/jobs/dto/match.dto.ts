import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class MatchJobDto {
  @IsOptional()
  @IsNumber()
  jobId?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class MatchResultDto {
  id: number;
  name: string;
  summary: string;
  similarity: number;
}

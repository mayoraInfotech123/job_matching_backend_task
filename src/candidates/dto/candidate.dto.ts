import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCandidateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  summary: string;
}

export class CandidateResponseDto {
  id: number;
  name: string;
  summary: string;
  created_at: Date;
  updated_at: Date;
}

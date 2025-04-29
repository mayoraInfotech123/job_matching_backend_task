import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto, CandidateResponseDto } from './dto/candidate.dto';

@Controller('api/candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  async create(
    @Body() createCandidateDto: CreateCandidateDto,
  ): Promise<CandidateResponseDto> {
    return this.candidatesService.create(createCandidateDto);
  }

  @Get()
  async findAll(): Promise<CandidateResponseDto[]> {
    return this.candidatesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CandidateResponseDto> {
    const candidate = await this.candidatesService.findById(+id);

    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { embedding, ...candidateResponse } = candidate;
    return candidateResponse as CandidateResponseDto;
  }
}

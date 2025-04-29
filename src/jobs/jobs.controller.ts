import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, JobResponseDto } from './dto/job.dto';

@Controller('api/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(@Body() createJobDto: CreateJobDto): Promise<JobResponseDto> {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  async findAll(): Promise<JobResponseDto[]> {
    return this.jobsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<JobResponseDto> {
    const job = await this.jobsService.findById(+id);

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { embedding, ...jobResponse } = job;
    return jobResponse as JobResponseDto;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto, JobResponseDto } from './dto/job.dto';
import { generateMockEmbedding } from '../utils/mock-embeddings';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<JobResponseDto> {
    const { title, description } = createJobDto;

    // Generate embedding for job description
    const embedding = generateMockEmbedding(`${title} ${description}`);

    // Create and save the job
    const job = this.jobRepository.create({
      title,
      description,
      embedding,
    });

    const savedJob = await this.jobRepository.save(job);

    // Return job without embedding
    const { embedding: _, ...jobResponse } = savedJob;
    return jobResponse as JobResponseDto;
  }

  async findById(id: number): Promise<Job | null> {
    return this.jobRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<JobResponseDto[]> {
    const jobs = await this.jobRepository.find();
    return jobs.map((job) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { embedding, ...jobResponse } = job;
      return jobResponse as JobResponseDto;
    });
  }
}

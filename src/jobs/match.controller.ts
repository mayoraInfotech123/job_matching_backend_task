import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CandidatesService } from '../candidates/candidates.service';
import { MatchJobDto, MatchResultDto } from './dto/match.dto';
import { generateMockEmbedding } from '../utils/mock-embeddings';

@Controller('api/match')
export class MatchController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly candidatesService: CandidatesService,
  ) {}

  @Post()
  async findMatches(
    @Body() matchJobDto: MatchJobDto,
  ): Promise<MatchResultDto[]> {
    // Check if we have either job ID or description
    if (!matchJobDto.jobId && !matchJobDto.description) {
      throw new BadRequestException(
        'Either jobId or description must be provided',
      );
    }

    let embedding: number[] = [];

    // If job ID is provided, fetch the job and use its embedding
    if (matchJobDto.jobId) {
      const job = await this.jobsService.findById(matchJobDto.jobId);
      if (!job) {
        throw new BadRequestException(
          `Job with ID ${matchJobDto.jobId} not found`,
        );
      }
      embedding = job.embedding;
    }
    // Otherwise, generate embedding from the provided description
    else if (matchJobDto.description) {
      embedding = generateMockEmbedding(matchJobDto.description);
    }

    // Find candidates that match the embedding
    const matches = (await this.candidatesService.findMatchingCandidates(
      embedding,
    )) as {
      id: string;
      name: string;
      summary: string;
      similarity: string;
    }[];

    // Transform the results to the expected format
    return matches.map((match) => ({
      id: parseInt(match.id, 10),
      name: match.name,
      summary: match.summary,
      similarity: parseFloat(match.similarity),
    }));
  }
}

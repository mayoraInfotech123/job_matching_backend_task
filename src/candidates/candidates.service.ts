import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';
import { CreateCandidateDto, CandidateResponseDto } from './dto/candidate.dto';
import { generateMockEmbedding } from '../utils/mock-embeddings';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
  ) {}

  async create(
    createCandidateDto: CreateCandidateDto,
  ): Promise<CandidateResponseDto> {
    const { name, summary } = createCandidateDto;

    // Generate embedding for candidate summary
    const embedding = generateMockEmbedding(`${name} ${summary}`);

    // Create and save the candidate
    const candidate = this.candidateRepository.create({
      name,
      summary,
      embedding,
    });

    const savedCandidate = await this.candidateRepository.save(candidate);

    // Return candidate without embedding
    const { embedding: _, ...candidateResponse } = savedCandidate;
    return candidateResponse as CandidateResponseDto;
  }

  async findById(id: number): Promise<Candidate | null> {
    return this.candidateRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<CandidateResponseDto[]> {
    const candidates = await this.candidateRepository.find();
    return candidates.map((candidate) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { embedding, ...candidateResponse } = candidate;
      return candidateResponse as CandidateResponseDto;
    });
  }

  async findMatchingCandidates(embedding: number[], limit = 3): Promise<any[]> {
    // Convert the JavaScript array to PostgreSQL vector syntax
    const vectorString = `[${embedding.join(',')}]`;

    // Query to find candidates with the highest cosine similarity
    const query = `
      SELECT 
        c.id, 
        c.name, 
        c.summary, 
        1 - (c.embedding <=> $1) as similarity 
      FROM 
        candidates c 
      ORDER BY 
        similarity DESC 
      LIMIT $2
    `;

    // Execute the query with the embedding vector and limit
    return this.candidateRepository.query(query, [vectorString, limit]);
  }
}

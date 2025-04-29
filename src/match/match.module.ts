import { Module } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { CandidatesModule } from '../candidates/candidates.module';
import { MatchController } from './match.controller';

@Module({
  imports: [JobsModule, CandidatesModule],
  controllers: [MatchController],
})
export class MatchModule {}

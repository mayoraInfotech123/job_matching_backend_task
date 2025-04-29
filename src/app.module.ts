import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { CandidatesModule } from './candidates/candidates.module';
import { MatchModule } from './match/match.module';
import { databaseConfig } from './config/database.config';
import { VectorColumnSubscriber } from './utils/typeorm/vector-column.subscriber';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...databaseConfig,
      subscribers: [VectorColumnSubscriber],
    }),
    JobsModule,
    CandidatesModule,
    MatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

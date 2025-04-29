import * as fs from 'fs';
import * as path from 'path';
import { generateMockEmbedding } from '../src/utils/mock-embeddings';
// Import type definitions from pg
import type { PoolConfig, Pool as PgPool } from 'pg';

// Define types for our sample data
interface Candidate {
  name: string;
  summary: string;
}

interface Job {
  title: string;
  description: string;
}

interface SampleData {
  candidates: Candidate[];
  jobs: Job[];
}

// Define our own SafePool interface to ensure TypeScript type safety
interface SafePool {
  query: (text: string, params: any[]) => Promise<any>;
  end: () => Promise<void>;
}

// Define the structure for the dynamic import result
interface PgModule {
  Pool: new (config: PoolConfig) => PgPool;
}

// Load sample data with proper typing
const sampleData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/sample.json'), 'utf-8'),
) as SampleData;

// Database connection configuration
const dbConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'job_matching',
};

// Create pool dynamically to avoid TypeScript error
async function createPool(): Promise<SafePool> {
  // Use a properly typed dynamic import with parentheses
  const pgModule = (await import('pg')) as PgModule;
  const Pool = pgModule.Pool;
  // Create the pool with proper typing
  return new Pool(dbConfig) as unknown as SafePool;
}

async function seedDatabase(): Promise<void> {
  // Create pool instance
  const pool = await createPool();

  try {
    // Seed candidates
    for (const candidate of sampleData.candidates) {
      const embedding = generateMockEmbedding(
        `${candidate.name} ${candidate.summary}`,
      );

      await pool.query(
        'INSERT INTO candidates (name, summary, embedding) VALUES ($1, $2, $3)',
        [candidate.name, candidate.summary, embedding],
      );
      console.log(`Added candidate: ${candidate.name}`);
    }

    // Seed jobs
    for (const job of sampleData.jobs) {
      const embedding = generateMockEmbedding(
        `${job.title} ${job.description}`,
      );

      await pool.query(
        'INSERT INTO jobs (title, description, embedding) VALUES ($1, $2, $3)',
        [job.title, job.description, embedding],
      );
      console.log(`Added job: ${job.title}`);
    }

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Execute seed function with proper promise handling
// Use void operator to handle the unhandled promise error
void (async () => {
  try {
    await seedDatabase();
  } catch (err) {
    console.error('Failed to seed database:', err);
    process.exit(1);
  }
})();

-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create jobs table with vector support
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  embedding VECTOR(384) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create candidates table with vector support
CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  embedding VECTOR(384) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster vector similarity search
CREATE INDEX ON jobs USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX ON candidates USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);


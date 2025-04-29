# Job-Candidate Matching System Backend

This is the backend for a job-candidate matching system that uses vector similarity in PostgreSQL to match job descriptions with candidate profiles.

## Features

- Store job postings with vector embeddings
- Store candidate profiles with vector embeddings
- Match candidates to jobs using cosine similarity
- RESTful API built with NestJS

## Technology Stack

- **NestJS**: Backend framework
- **PostgreSQL**: Database
- **pgvector**: PostgreSQL extension for vector operations
- **TypeORM**: Object-Relational Mapping tool

## Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+) with pgvector extension installed
- npm or yarn

## Database Setup

1. Install the pgvector extension in your PostgreSQL database:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

2. Create the database schema:

```bash
psql -U your_db_user -d your_db_name -f scripts/schema.sql
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables (create a `.env` file):

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=job_matching
```

## Running the Application

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### 1. Create a Job

- **Endpoint**: `POST /api/jobs`
- **Description**: Adds a new job to the database with auto-generated vector embedding
- **Request Body**:

```json
{
  "title": "Software Engineer",
  "description": "We're looking for a full-stack engineer with experience in React and Node.js"
}
```

### 2. Create a Candidate

- **Endpoint**: `POST /api/candidates`
- **Description**: Adds a new candidate to the database with auto-generated vector embedding
- **Request Body**:

```json
{
  "name": "John Doe",
  "summary": "Full-stack developer with 5 years of experience in React, Node.js, and PostgreSQL"
}
```

### 3. Match Candidates to a Job

- **Endpoint**: `POST /api/match`
- **Description**: Returns the top 3 candidates that match a job based on vector similarity
- **Request Body** (with job ID):

```json
{
  "jobId": 1
}
```

OR (with job description):

```json
{
  "description": "Looking for an expert in React and PostgreSQL"
}
```

## Vector Similarity Implementation

This project uses mock embeddings to simulate the behavior of real ML-generated embeddings. The approach is as follows:

1. **Generating Mock Embeddings**: 
   - We use a deterministic algorithm to convert text into fixed-length vectors (384 dimensions)
   - The algorithm processes character codes and positions to generate unique vectors that capture some semantic meaning
   - Vectors are normalized to ensure consistent cosine similarity calculations

2. **Storing Vectors in PostgreSQL**:
   - We use the `pgvector` extension to store embeddings as VECTOR type
   - Each job and candidate has an associated embedding vector

3. **Performing Similarity Searches**:
   - Cosine similarity is used to match job vectors with candidate vectors
   - The `<=>` operator provided by pgvector calculates the cosine distance
   - Results are ordered by similarity (1 - distance) to find the best matches

## Database Schema

### Jobs Table
```sql
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  embedding VECTOR(384) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Candidates Table
```sql
CREATE TABLE candidates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  embedding VECTOR(384) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Seeding Sample Data

To populate the database with sample data:

```bash
npm run build
node dist/scripts/seed.js
```

## Testing the API

You can test the API using tools like Postman or curl:

```bash
# Create a job
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Software Developer","description":"Looking for a Node.js developer with PostgreSQL experience"}'

# Create a candidate
curl -X POST http://localhost:3000/api/candidates \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","summary":"Full-stack developer with TypeScript, Node.js, and PostgreSQL skills"}'

# Match candidates to a job
curl -X POST http://localhost:3000/api/match \
  -H "Content-Type: application/json" \
  -d '{"jobId":1}'
```

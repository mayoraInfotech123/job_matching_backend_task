/**
 * Utility for generating mock embeddings for text content.
 * In a real-world scenario, this would be replaced by a call to an actual language model.
 */

// We'll use 5 dimensions for our mock embeddings for simplicity
const VECTOR_DIMENSIONS = 384;

/**
 * Generates a deterministic mock embedding vector for text input.
 * The algorithm converts the text to a fixed-size vector by hashing.
 * @param text The input text to generate an embedding for
 * @returns An array of floating point numbers representing the embedding vector
 */
export function generateMockEmbedding(text: string): number[] {
  // Create a vector of the appropriate size
  const embedding: number[] = new Array<number>(VECTOR_DIMENSIONS).fill(0);

  // Simple deterministic algorithm to generate values based on the input text
  // This ensures the same text always produces the same vector
  const normalizedText = text.toLowerCase();

  // Use character codes and positions to populate the vector
  for (let i = 0; i < normalizedText.length; i++) {
    const charCode = normalizedText.charCodeAt(i);
    const position = i % VECTOR_DIMENSIONS;

    // Update the vector based on character code
    embedding[position] += charCode / 1000;

    // Add some cross-dimension information
    const secondaryPos = (position * 31) % VECTOR_DIMENSIONS;
    embedding[secondaryPos] += charCode / 2000;
  }

  // Normalize the vector to have unit length (important for cosine similarity)
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0),
  );

  return embedding.map((val) => val / (magnitude || 1));
}

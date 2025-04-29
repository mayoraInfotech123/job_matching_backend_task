import { ValueTransformer } from 'typeorm';

/**
 * Custom TypeORM transformer for pgvector compatibility.
 * Handles conversion between JavaScript arrays and PostgreSQL vector type.
 */
export class VectorColumnType {
  private constructor() {}

  static instance = new VectorColumnType();

  /**
   * Creates a PostgreSQL vector value from a JavaScript array
   */
  create(value: number[]): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    return `[${value.join(',')}]`;
  }

  /**
   * Name of the object type in the database
   */
  toSql(): string {
    return 'vector';
  }

  /**
   * Converts value from the database to a JavaScript value
   */
  parse(value: string): number[] | null {
    if (value === null || value === undefined) {
      return null;
    }

    // Remove the surrounding brackets and split by commas
    const cleanedValue = value.substring(1, value.length - 1);
    return cleanedValue.split(',').map(Number);
  }

  /**
   * Get transformer for TypeORM
   */
  getTransformer(): ValueTransformer {
    return {
      to: (value: number[]) => this.create(value),
      from: (value: string) => this.parse(value),
    };
  }
}

import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
} from 'typeorm';

/**
 * A TypeORM subscriber that provides support for pgvector types
 * Note: We implement the required interface method but don't need actual functionality
 * as we're handling conversion through transformers in the entities
 */
@EventSubscriber()
export class VectorColumnSubscriber implements EntitySubscriberInterface {
  constructor(private dataSource: DataSource) {}

  // This is a required method to satisfy the EntitySubscriberInterface
  listenTo() {
    return Object; // Return a valid Function type to satisfy the interface
  }
}

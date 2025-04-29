import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VectorColumnType } from '../../utils/typeorm/vector-column.type';

@Entity('candidates')
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  summary: string;

  @Column({
    type: 'text',
    transformer: VectorColumnType.instance.getTransformer(),
  })
  embedding: number[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

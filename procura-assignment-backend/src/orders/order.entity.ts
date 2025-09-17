import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'jsonb' })
  customer!: {
    name: string;
    phone: string;
  };

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount!: number;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems?: OrderItem[];
}

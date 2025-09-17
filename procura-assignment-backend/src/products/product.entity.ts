import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { OrderItem } from '../orders/order-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, unique: true })
  code!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rate!: number;

  @Column({ type: 'text', nullable: true })
  image?: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems?: OrderItem[];
}

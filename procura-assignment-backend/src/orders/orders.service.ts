import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { customer, orderItems } = createOrderDto;
    
    // Calculate total amount
    const total_amount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order
    const order = this.orderRepository.create({
      customer,
      total_amount,
    });
    
    const savedOrder = await this.orderRepository.save(order);
    
    // Create order items
    const orderItemEntities = orderItems.map(item => 
      this.orderItemRepository.create({
        ...item,
        order_id: savedOrder.id,
      })
    );
    
    await this.orderItemRepository.save(orderItemEntities);
    
    // Return order with items
    return await this.findOne(savedOrder.id);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['orderItems', 'orderItems.product'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.product'],
    });
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    
    if (updateOrderDto.customer) {
      order.customer = updateOrderDto.customer;
    }
    
    // If order items are being updated, remove existing ones and create new ones
    if (updateOrderDto.orderItems) {
      await this.orderItemRepository.delete({ order_id: id });
      
      const total_amount = updateOrderDto.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      order.total_amount = total_amount;
      
      const orderItemEntities = updateOrderDto.orderItems.map(item => 
        this.orderItemRepository.create({
          ...item,
          order_id: id,
        })
      );
      
      await this.orderItemRepository.save(orderItemEntities);
    }
    
    await this.orderRepository.save(order);
    
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }
}

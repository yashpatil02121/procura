import { IsObject, IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;
}

export class OrderItemDto {
  @IsInt()
  @Min(1)
  product_id!: number;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @Min(0)
  price!: number;
}

export class CreateOrderDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer!: CustomerDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems!: OrderItemDto[];
}

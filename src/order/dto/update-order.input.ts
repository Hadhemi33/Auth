import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

@InputType() // GraphQL Input Type
export class UpdateOrderInput {
  @Field() // ID of the order to update
  @IsString() // Validation: ensure it's a string
  id: string;

  @Field({ nullable: true }) // Allow optional fields for partial updates
  @IsOptional() // Validation: this field is optional
  @IsString() // Validation: must be a string
  totalPrice?: string; // Example field to update, using string to represent price

  @Field({ nullable: true }) // Optional field for updating the 'paid' status
  @IsOptional()
  @IsBoolean() // Validate as a boolean
  paid?: boolean;
  // Add other fields as needed, ensuring correct types and validation
}

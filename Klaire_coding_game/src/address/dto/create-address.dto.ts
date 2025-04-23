import { IsString, IsNotEmpty } from "class-validator";

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  q: string;
}
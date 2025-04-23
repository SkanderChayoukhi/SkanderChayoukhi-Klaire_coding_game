import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class CreateAddressDto {
  @IsString({message: "Le champ 'q' doit être une chaîne de caractères."})
  @IsNotEmpty({ message: "Le champ 'q' est requis." })
  @MinLength(1, { message: "Le champ 'q' doit être une chaîne non vide." })
  q: string;
}
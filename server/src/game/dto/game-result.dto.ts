import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class GameResultDto {
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @Min(0)
  speed: number;

  @IsNumber()
  @Min(0)
  accuracy: number;

  @IsNotEmpty()
  textId: string;
}
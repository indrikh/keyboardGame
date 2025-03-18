import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TextDocument = Text & Document;

@Schema()
export class Text {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, enum: ['ru', 'en'] })
  language: string;

  @Prop({ required: true })
  difficulty: number;
}

export const TextSchema = SchemaFactory.createForClass(Text);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Article } from './article.schema';

@Schema({ timestamps: true })
export class Viewer extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Article',
    required: true,
  })
  article: Article | Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  lastViewed: Date;

  @Prop({ default: Date.now, expires: 60 * 5 }) // TTL 5 минут
  expiresAt: Date;
}

export const ViewerSchema = SchemaFactory.createForClass(Viewer);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type ArticleDocument = Article & Document;

export enum Category {
  TECHNOLOGY = 'TECHNOLOGY',
  SCIENCE = 'SCIENCE',
  ART = 'ART',
  BUSINESS = 'BUSINESS',
  HEALTH = 'HEALTH',
}

export enum Theme {
  PROGRAMMING = 'PROGRAMMING',
  DESIGN = 'DESIGN',
  BIOLOGY = 'BIOLOGY',
  STARTUPS = 'STARTUPS',
  NUTRITION = 'NUTRITION',
}

export enum Subtheme {
  WEB_DEVELOPMENT = 'WEB_DEVELOPMENT',
  UX_UI = 'UX_UI',
  GENETICS = 'GENETICS',
  FINANCING = 'FINANCING',
  FITNESS = 'FITNESS',
}

export enum Tag {
  LINUX = 'LINUX',
  TUTORIAL = 'TUTORIAL',
  RESEARCH = 'RESEARCH',
  INNOVATION = 'INNOVATION',
  WELLNESS = 'WELLNESS',
}

@Schema({ timestamps: true })
export class Article {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  image?: string;

  @Prop({ type: String, enum: Category, required: true })
  category: Category;

  @Prop({ type: String, enum: Theme, required: true })
  theme: Theme;

  @Prop({ type: String, enum: Subtheme, required: true })
  subtheme: Subtheme;

  @Prop({ type: [String], enum: Tag, default: [] })
  tags: Tag[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: User | Types.ObjectId;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  comments: number;

  @Prop({ default: 4 })
  readingTime?: number;

  @Prop({ default: false })
  published: boolean;

  @Prop()
  publishedAt?: Date;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

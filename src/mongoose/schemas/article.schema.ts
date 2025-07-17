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
  CARS = 'CARS',
  BIOGRAPHY = 'BIOGRAPHY',
  WINE = 'WINE',
  NEWSPAPERS = 'NEWSPAPERS',
  DEMOCRACY = 'DEMOCRACY',
  FOOD = 'FOOD',
  PAINTING = 'PAINTING',
  HEALTH = 'HEALTH',
  ART = 'ART',
  BOOKS = 'BOOKS',
  LITERATURE = 'LITERATURE',
  MUSIC = 'MUSIC',
  SCIENCE = 'SCIENCE',
  SOCIETY = 'SOCIETY',
  WRITERS = 'WRITERS',
  RELIGION = 'RELIGION',
  SPORTS = 'SPORTS',
  THEATER = 'THEATER',
  PHILOSOPHY = 'PHILOSOPHY',
  TECHNOLOGY = 'TECHNOLOGY',
  CINEMA = 'CINEMA',
  TRAVEL = 'TRAVEL',
  ECONOMICS = 'ECONOMICS',
  HISTORY = 'HISTORY',
  PSYCHOLOGY = 'PSYCHOLOGY',
  EDUCATION = 'EDUCATION',
  FASHION = 'FASHION',
  GAMING = 'GAMING',
  POLITICS = 'POLITICS',
  ECOLOGY = 'ECOLOGY',
  ASTRONOMY = 'ASTRONOMY',
  LAW = 'LAW',
  LINGUISTICS = 'LINGUISTICS',
  ARCHITECTURE = 'ARCHITECTURE',
  PHOTOGRAPHY = 'PHOTOGRAPHY',
  MARKETING = 'MARKETING',
  INVESTMENTS = 'INVESTMENTS',
  COOKING = 'COOKING',
  ANIMALS = 'ANIMALS',
  GARDENING = 'GARDENING',
  MILITARY = 'MILITARY',
  AI = 'AI',
  CYBERSECURITY = 'CYBERSECURITY',
  SPACE = 'SPACE',
  FINTECH = 'FINTECH',
  CRYPTO = 'CRYPTO',
  MEDICINE = 'MEDICINE',
  FITNESS = 'FITNESS',
  DIY = 'DIY',
  HUMOR = 'HUMOR',
  PARENTING = 'PARENTING',
  RELATIONSHIPS = 'RELATIONSHIPS',
  CAREER = 'CAREER',
  MOTIVATION = 'MOTIVATION',
  URBANISM = 'URBANISM',
  FUTUROLOGY = 'FUTUROLOGY',
}

export enum Subtheme {
  // Основные подтемы
  WEB_DEVELOPMENT = 'WEB_DEVELOPMENT',
  UX_UI = 'UX_UI',
  GENETICS = 'GENETICS',
  FINANCING = 'FINANCING',
  FITNESS = 'FITNESS',

  // Программирование и IT
  MOBILE_DEVELOPMENT = 'MOBILE_DEVELOPMENT',
  GAME_DEV = 'GAME_DEV',
  DATA_SCIENCE = 'DATA_SCIENCE',
  BLOCKCHAIN = 'BLOCKCHAIN',
  DEVOPS = 'DEVOPS',
  CYBERSECURITY = 'CYBERSECURITY',
  AI_ML = 'AI_ML',

  // Дизайн
  GRAPHIC_DESIGN = 'GRAPHIC_DESIGN',
  TYPOGRAPHY = 'TYPOGRAPHY',
  BRANDING = 'BRANDING',
  MOTION_DESIGN = 'MOTION_DESIGN',

  // Биология и медицина
  NEUROSCIENCE = 'NEUROSCIENCE',
  ECOLOGY = 'ECOLOGY',
  MICROBIOLOGY = 'MICROBIOLOGY',
  BIOENGINEERING = 'BIOENGINEERING',

  // Стартапы и бизнес
  VENTURE_CAPITAL = 'VENTURE_CAPITAL',
  ENTREPRENEURSHIP = 'ENTREPRENEURSHIP',
  PRODUCT_MANAGEMENT = 'PRODUCT_MANAGEMENT',
  LEAN_STARTUP = 'LEAN_STARTUP',

  // Здоровье и спорт
  YOGA = 'YOGA',
  NUTRITION = 'NUTRITION',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  EXTREME_SPORTS = 'EXTREME_SPORTS',

  // Искусство и культура
  STREET_ART = 'STREET_ART',
  DIGITAL_ART = 'DIGITAL_ART',
  CLASSIC_MUSIC = 'CLASSIC_MUSIC',
  INDIE_CINEMA = 'INDIE_CINEMA',

  // Наука и технологии
  QUANTUM_PHYSICS = 'QUANTUM_PHYSICS',
  ROBOTICS = 'ROBOTICS',
  NANOTECHNOLOGY = 'NANOTECHNOLOGY',
  SPACE_EXPLORATION = 'SPACE_EXPLORATION',

  // Литература и книги
  SCIENCE_FICTION = 'SCIENCE_FICTION',
  POETRY = 'POETRY',
  NON_FICTION = 'NON_FICTION',
  BOOK_REVIEWS = 'BOOK_REVIEWS',

  // Дополнительные категории
  ETHICAL_HACKING = 'ETHICAL_HACKING',
  CRYPTOCURRENCIES = 'CRYPTOCURRENCIES',
  SUSTAINABILITY = 'SUSTAINABILITY',
  PERSONAL_GROWTH = 'PERSONAL_GROWTH',
}

export enum Tag {
  // Basic tags
  LINUX = 'LINUX',
  TUTORIAL = 'TUTORIAL',
  RESEARCH = 'RESEARCH',
  INNOVATION = 'INNOVATION',
  WELLNESS = 'WELLNESS',

  // Technology and IT
  PYTHON = 'PYTHON',
  JAVASCRIPT = 'JAVASCRIPT',
  REACT = 'REACT',
  DOCKER = 'DOCKER',
  AWS = 'AWS',
  STARTUP = 'STARTUP',
  GITHUB = 'GITHUB',
  ALGORITHMS = 'ALGORITHMS',

  // Science and education
  SCIENCE = 'SCIENCE',
  DISCOVERY = 'DISCOVERY',
  EXPERIMENT = 'EXPERIMENT',
  UNIVERSITY = 'UNIVERSITY',
  ONLINE_COURSES = 'ONLINE_COURSES',

  // Health and lifestyle
  NUTRITION = 'NUTRITION',
  MEDITATION = 'MEDITATION',
  YOGA = 'YOGA',
  RUNNING = 'RUNNING',
  BIOHACKING = 'BIOHACKING',

  // Business and career
  LEADERSHIP = 'LEADERSHIP',
  PRODUCTIVITY = 'PRODUCTIVITY',
  REMOTE_WORK = 'REMOTE_WORK',
  INVESTMENT = 'INVESTMENT',
  CAREER = 'CAREER',

  // Creativity and art
  DESIGN = 'DESIGN',
  PHOTOGRAPHY = 'PHOTOGRAPHY',
  WRITING = 'WRITING',
  CREATIVITY = 'CREATIVITY',
  INSPIRATION = 'INSPIRATION',

  // Current trends
  AI = 'AI',
  METAVERSE = 'METAVERSE',
  CRYPTO = 'CRYPTO',
  ESG = 'ESG',
  WEB3 = 'WEB3',

  // Miscellaneous
  CASE_STUDY = 'CASE_STUDY',
  OPINION = 'OPINION',
  INTERVIEW = 'INTERVIEW',
  EVENT = 'EVENT',
  HISTORY = 'HISTORY',
}

@Schema({ timestamps: true })
export class Article {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ type: Object, required: true }) // Храним JSON-структуру TipTap
  content: Record<string, any>;

  @Prop()
  plainText: string;

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

ArticleSchema.index(
  {
    title: 'text',
    plainText: 'text',
    tags: 'text',
  },
  {
    weights: {
      title: 10,
      plainText: 5,
      tags: 3,
    },
  },
);

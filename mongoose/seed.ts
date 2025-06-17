import { faker } from '@faker-js/faker/locale/ru';
import * as mongoose from 'mongoose';

import { ObjectId } from 'mongodb';
import {
  Category,
  Subtheme,
  Tag,
  Theme,
} from '../src/mongoose/schemas/article.schema';

async function createArticles() {
  if (!mongoose.connection.db) {
    throw new Error('Ошибка Подключения');
  }

  await mongoose.connection.db.collection('articles').deleteMany({});

  const categories = Object.values(Category);
  const themes = Object.values(Theme);
  const subthemes = Object.values(Subtheme);
  const tags = Object.values(Tag);

  const articlesData: any = [];

  for (let i = 0; i < 15; i++) {
    const randomTags = faker.helpers.arrayElements(
      tags,
      faker.number.int({ min: 1, max: 4 }),
    );

    articlesData.push({
      _id: new ObjectId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(faker.number.int({ min: 3, max: 10 })),
      image: faker.image.urlLoremFlickr({ category: 'technology' }),
      category: faker.helpers.arrayElement(categories),
      theme: faker.helpers.arrayElement(themes),
      subtheme: faker.helpers.arrayElement(subthemes),
      tags: randomTags,
      author: new ObjectId('6842af86813f7c5421df3c52'),
      views: faker.number.int({ min: 0, max: 1000 }),
      comments: faker.number.int({ min: 1, max: 5 }),
      readingTime: faker.number.int({ min: 1, max: 10 }),
      published: faker.datatype.boolean(),
      publishedAt: faker.datatype.boolean() ? faker.date.past() : undefined,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }

  const result = await mongoose.connection.db
    .collection('articles')
    .insertMany(articlesData);
  return result.insertedCount;
}

async function generate() {
  try {
    await mongoose.connect(
      'mongodb+srv://jwhh2a:lKkRYTPxbBlfEaVM@cluster0.q6neoxr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    );
    console.log('Подключено');

    const count = await createArticles();
    console.log(`Успешно создано ${count} статей.`);
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
  } finally {
    await mongoose.disconnect();
  }
}

generate();

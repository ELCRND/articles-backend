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

  // Функция для генерации случайного TipTap JSON и plainText
  const generateContent = () => {
    const paragraphCount = faker.number.int({ min: 3, max: 10 });
    const tipTapContent = {
      type: 'doc',
      content: [] as any[],
    };
    let plainText = '';

    for (let i = 0; i < paragraphCount; i++) {
      const sentence = faker.lorem.sentence();
      const words = sentence.split(' ');

      // Добавляем в TipTap
      tipTapContent.content.push({
        type: 'paragraph',
        content: words.map((word, index) => ({
          type: 'text',
          text: word + (index === words.length - 1 ? '' : ' '),
          marks: faker.datatype.boolean(0.3)
            ? [
                {
                  type: faker.helpers.arrayElement([
                    'bold',
                    'italic',
                    'underline',
                  ]),
                },
              ]
            : undefined,
        })),
      });

      // Добавляем в plainText
      plainText += sentence + '\n\n';
    }

    return { tipTapContent, plainText };
  };

  for (let i = 0; i < 15; i++) {
    const randomTags = faker.helpers.arrayElements(
      tags,
      faker.number.int({ min: 1, max: 4 }),
    );

    const { tipTapContent, plainText } = generateContent();

    articlesData.push({
      _id: new ObjectId(),
      title: faker.lorem.sentence(),
      content: tipTapContent,
      plainText: plainText.trim(), // сохраняем plainText для поиска
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

// Вспомогательная функция для извлечения plainText из TipTap JSON
function extractPlainText(tiptapContent: Record<string, any>): string {
  let plainText = '';

  if (tiptapContent.content) {
    for (const block of tiptapContent.content) {
      if (block.content) {
        for (const item of block.content) {
          if (item.content) {
            for (const textItem of item.content) {
              if (textItem.text) {
                plainText += textItem.text;
              }
            }
          }
        }
      }
      plainText += '\n\n';
    }
  }

  return plainText.trim();
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

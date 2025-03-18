import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GameService } from './game/game.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const gameService = app.get(GameService);

  // Русские тексты
  const ruTexts = [
    {
      content: 'Быстрая коричневая лиса прыгает через ленивую собаку. Это стандартная фраза для проверки навыка печати.',
      language: 'ru',
      difficulty: 1,
    },
    {
      content: 'Разработка программного обеспечения требует внимания к деталям, логического мышления и творческого подхода к решению сложных задач.',
      language: 'ru',
      difficulty: 2,
    },
    {
      content: 'Клавиатурные тренажеры помогают развить навык слепого метода печати, увеличить скорость набора текста и снизить количество ошибок.',
      language: 'ru',
      difficulty: 2,
    },
    {
      content: 'Облачные вычисления позволяют компаниям сократить расходы на инфраструктуру, повысить гибкость и масштабируемость своих приложений.',
      language: 'ru',
      difficulty: 3,
    },
  ];

  // Английские тексты
  const enTexts = [
    {
      content: 'The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet.',
      language: 'en',
      difficulty: 1,
    },
    {
      content: 'Software development requires attention to detail, logical thinking, and a creative approach to solving complex problems.',
      language: 'en',
      difficulty: 2,
    },
    {
      content: 'Keyboard trainers help develop touch typing skills, increase typing speed, and reduce the number of errors made while typing.',
      language: 'en',
      difficulty: 2,
    },
    {
      content: 'Cloud computing allows companies to reduce infrastructure costs, increase flexibility, and improve the scalability of their applications.',
      language: 'en',
      difficulty: 3,
    },
  ];

  // Создаем тексты
  for (const text of [...ruTexts, ...enTexts]) {
    await gameService.create(text);
    console.log(`Created text: ${text.content.substring(0, 30)}...`);
  }

  console.log('Seed completed!');
  await app.close();
}

bootstrap();
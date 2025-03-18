FROM node:16-alpine

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY . .

# Устанавливаем переменные среды
ENV NODE_ENV=production
ENV PORT=3000

# Собираем приложение
RUN npm run build

# Открываем порт
EXPOSE 3000

# Запускаем сервер
CMD ["npm", "start"]
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Game() {
  const { user } = useAuth();
  const [text, setText] = useState<any>(null);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [language, setLanguage] = useState('ru');
  const [countdown, setCountdown] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadText();
  }, [language]);

  const loadText = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/game/text?language=${language}`);
      setText(response.data);
      resetGame();
    } catch (error) {
      console.error('Error loading text:', error);
    }
  };

  const resetGame = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsGameOver(false);
    setAccuracy(0);
    setWpm(0);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setStartTime(Date.now());
      setCountdown(null);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [countdown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (!startTime) {
      setStartTime(Date.now());
    }
    
    setUserInput(value);
    
    // Calculate current accuracy
    let correctChars = 0;
    for (let i = 0; i < value.length; i++) {
      if (i < text.content.length && value[i] === text.content[i]) {
        correctChars++;
      }
    }
    
    const currentAccuracy = (correctChars / value.length) * 100 || 0;
    setAccuracy(Math.round(currentAccuracy * 100) / 100);
    
    // Check if game is over
    if (value === text.content) {
      const endTime = Date.now();
      setEndTime(endTime);
      setIsGameOver(true);
      
      // Calculate WPM (Words Per Minute)
      const minutes = (endTime - (startTime || endTime)) / 60000;
      const words = text.content.split(' ').length;
      const calculatedWpm = Math.round(words / minutes);
      setWpm(calculatedWpm);
      
      // Save result if user is logged in
      if (user) {
        saveResult(calculatedWpm, currentAccuracy);
      }
    }
  };

  const saveResult = async (speed: number, accuracy: number) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/game/result`,
        {
          userId: user._id,
          speed,
          accuracy,
          textId: text._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Клавогонки - Игра</title>
      </Head>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Тренажер печати</h1>
          <div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="ml-2 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={startTime && !isGameOver}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {text ? (
          <>
            <div className="p-4 bg-gray-100 rounded-lg mb-4 text-lg">
              {countdown !== null ? (
                <div className="flex items-center justify-center h-32">
                  <span className="text-4xl font-bold">{countdown > 0 ? countdown : 'Печатайте!'}</span>
                </div>
              ) : (
                text.content.split('').map((char: string, index: number) => {
                  let className = '';
                  if (index < userInput.length) {
                    className = userInput[index] === char ? 'text-green-600' : 'text-red-600 bg-red-100';
                  }
                  return (
                    <span key={index} className={className}>
                      {char}
                    </span>
                  );
                })
              )}
            </div>

            <div className="mb-4">
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                className="w-full p-4 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                rows={5}
                disabled={isGameOver || countdown !== null}
                placeholder="Начните печатать здесь..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-sm font-medium text-gray-500">Точность</div>
                <div className="text-3xl font-bold">{accuracy}%</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-sm font-medium text-gray-500">Скорость</div>
                <div className="text-3xl font-bold">{wpm} слов/мин</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-sm font-medium text-gray-500">Прогресс</div>
                <div className="text-3xl font-bold">
                  {Math.floor((userInput.length / text.content.length) * 100)}%
                </div>
              </div>
            </div>

            {isGameOver && (
              <div className="bg-green-100 p-4 rounded-lg text-center mb-6">
                <h2 className="text-2xl font-bold text-green-800">Отличная работа!</h2>
                <p className="text-green-700">
                  Вы набрали текст за {((endTime! - startTime!) / 1000).toFixed(1)} секунд со скоростью {wpm} слов/мин и точностью {accuracy}%.
                </p>
                <button
                  onClick={loadText}
                  className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  Еще раз
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">Загрузка текста...</div>
        )}
      </div>
    </Layout>
  );
}
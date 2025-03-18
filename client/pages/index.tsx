import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  return (
    <Layout>
      <Head>
        <title>Клавогонки - Главная</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Клавогонки</span>
            <span className="block text-indigo-600">Тренажер быстрой печати</span>
          </h1>
          <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg">
            Развивайте навык слепой печати, соревнуйтесь с другими игроками и следите за своим прогрессом
          </p>
          <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
            <div className="rounded-md shadow">
              <Link href="/game">
                <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                  Начать игру
                </a>
              </Link>
            </div>
            {!user && !isLoading && (
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Link href="/auth/login">
                  <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                    Войти
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
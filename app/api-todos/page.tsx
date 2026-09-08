import React from 'react';
import { getTasks } from '@/lib/tasks';
import ApiTodoList from './components/ApiTodoList';

export const revalidate = 60;

export default async function ApiTodosPage() {
  const { tasks } = await getTasks({ limit: 15, skip: 0 });

  return (
    <main className="min-h-screen p-6 md:p-10 bg-white text-dark-70">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
          <header className="mb-6 border-b border-gray-100 pb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-dark-70 text-center">
              Daftar Tugas (Todo List)
            </h1>
          </header>

          {/* Menampilkan Komponen ApiTodoList */}
          <ApiTodoList initialTasks={tasks} />
        </div>
      </div>
    </main>
  );
}
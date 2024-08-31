
export interface User {
  userId: number;
  userName: string;
  session: string[];
  email: string;
  password: string;
  usedPassword: string[];
}

export interface Data {
  users: User[];
}

import { pool } from './dataBase';
export async function getData(): Promise<Data> {
  let data: Data = { users: [] };

  try {
    console.log('Attempting to retrieve data from MySQL...');
    const [rows] = await pool.query('SELECT * FROM users');
    console.log('Data retrieved:', rows);
    data.users = rows as any[]; // 假设 rows 的结构符合 Data.users 的定义
  } catch (error) {
    console.error('Error retrieving data from MySQL:', error);
    throw error; // 你可以选择如何处理这个错误
  }

  return data;
}

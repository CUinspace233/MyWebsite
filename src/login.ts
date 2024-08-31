import { RowDataPacket } from 'mysql2';
import { BadRequestError } from './errors';
import { pool } from './dataBase'; // 假设数据库连接池在 database.ts 中
import { getHashedPassword, generateRandomToken } from './helperFunction';
import { getData } from './dataStore';

export async function login(
  email: string,
  password: string
): Promise<{ message: string } | null> {
  // 检查参数
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  try {
    // 查询数据库验证用户信息
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];
      
      // 检查密码是否匹配
      const data = await getData();
      const hash = getHashedPassword(password);
      const token = generateRandomToken(data);
      if (hash === user.password) {
        // 更新用户 session
        user.session.push(token);
        // 在数据库中的 users 中用户 session用jsonappend增加token
        await pool.query(
          'UPDATE users SET session = JSON_ARRAY_APPEND(session, "$", ?) WHERE email = ?',
          [token, email]
        );
        return { message: `Welcome to our website, ${user.username}!` };
      } else {
        throw new BadRequestError('Wrong email or password');
      }
    } else {
      throw new BadRequestError('Wrong email or password');
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error; // 将错误抛出以便在 server.ts 中处理
  }
}
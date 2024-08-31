import validator from 'validator';
import { getData } from './dataStore';
import { BadRequestError } from './errors';
import { isValidPassword } from './helperFunction';
import { getHashedPassword, generateRandomToken, generateRandomUserId } from './helperFunction';
import { pool } from './dataBase';
/**
 * Register a user with an email, password, and names, then returns their userId value.
 * @param {string} userName: user's entered username
 * @param {string} email: user's entered email
 * @param {string} password: user's entered password
 * @returns token of user for registration
 */
export async function adminAuthRegister(
  userName: string,
  email: string,
  password: string
): Promise<{ token: string }> {
  const data = await getData(); // 使用 await 等待 getData 完成

  // Check the validity of the email
  if (!validator.isEmail(email)) {
    throw new BadRequestError('Invalid email');
  }

  // Check if the email is already in use
  if (data.users.some(user => user.email === email)) {
    throw new BadRequestError('Email already in use');
  }

  // Check the validity of the password
  isValidPassword(password);

  // Hash the password
  password = getHashedPassword(password);

  // Register the user
  const newUserId = generateRandomUserId(data);
  const token = generateRandomToken(data);
  const newUser = {
    userId: newUserId,
    userName,
    session: [token],
    email,
    password,
    usedPassword: [password]
  };
  data.users.push(newUser);

  // 这里应该有一个保存新用户到数据库的操作，插入到mysql数据库
  // 你可以使用 pool.query() 函数来执行 SQL 语句
  await pool.query(
    `INSERT INTO users (userId, session, userName, email, password)
    VALUES (?, JSON_ARRAY(?), ?, ?, ?)`,
    [newUser.userId, token, newUser.userName, newUser.email, newUser.password]
  );
  return { token };
}
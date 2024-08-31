import { BadRequestError } from './src/errors';
import { adminAuthRegister } from './src/register';
import { login } from './src/login';
import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const PORT = 5500;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// 创建 MySQL 连接
const db = mysql.createConnection({
  host: 'localhost',  // 你的 MySQL 主机
  user: 'root',       // 你的 MySQL 用户名
  password: 'Linzh@031101', // 你的 MySQL 密码
  database: 'RegisterLogin'  // 你的 MySQL 数据库名称
});

// 连接到 MySQL
db.connect((err) => {
  if (err) {
      console.error('连接到 MySQL 数据库失败:', err);
      return;
  }
  console.log('成功连接到 MySQL 数据库');
});

// 创建一个 POST 路由来处理用户信息的写入
app.post('/register', async (req, res) => {

  console.log('Received register request:', req.body);
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send('Please provide username, email and password');
    }

    const result = await adminAuthRegister(username, email, password);

    res.json({ message: 'User registered successfully', token: result.token });
  } catch (error) {
    if (error instanceof BadRequestError) {
      res.status(400).send(error.message);
    } else {
      console.error('Error during registration:', error);
      res.status(500).send('An unexpected error occurred');
    }
  }
});

// 登录接口
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await login(email, password);
    res.json(result);
  } catch (error) {
    if (error instanceof BadRequestError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Login failed due to server error' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
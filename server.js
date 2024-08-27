const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 5500;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'linzehan20031101',
  database: 'RegisterLogin',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 注册接口
app.post('/register', (req, res) => {
  const { name, account, password } = req.body;

  if (!name || !account || !password) {
    return res.status(400).json({ error: '缺少必要的信息' });
  }

  // 插入用户信息到数据库
  pool.query('INSERT INTO users (name, account, password) VALUES (?, ?, ?)', [name, account, password], (error, results) => {
    if (error) {
      return res.status(500).json({ error: '注册失败' });
    }

    res.json({ message: '注册成功' });
  });
});

// 登录接口
app.post('/login', (req, res) => {
  const { name, account, password } = req.body;

  if (!name || !account || !password) {
    return res.status(400).json({ error: '缺少必要的信息' });
  }

  // 查询数据库验证用户信息
  pool.query('SELECT * FROM users WHERE account = ? AND password = ?', [account, password], (error, results) => {
    if (error) {
      return res.status(500).json({ error: '登录失败' });
    }

    if (results.length > 0) {
      res.json({ message: `欢迎进入本站，${name}！` });
    } else {
      res.status(401).json({ error: '用户名或密码错误' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT, role TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS grades (id INTEGER PRIMARY KEY AUTOINCREMENT, student_name TEXT, subject TEXT, grade REAL, professor_id INTEGER)");
});

app.post('/register', (req, res) => {
  const { email, password, role } = req.body;
  const sql = `INSERT INTO users (email, password, role) VALUES ('${email}', '${password}', '${role || 'student'}')`;
  db.run(sql, function(err) {
    if (err) {
      return res.status(500).send('Error registering user.');
    }
    res.status(201).send({ id: this.lastID });
  });
});

// Endpoint de Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // FALHA: Continua a usar SQL puro e a comparar senhas em texto puro
  const sql = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;

  db.get(sql, (err, user) => {
    if (err || !user) {
      return res.status(401).send('Invalid credentials');
    }
    res.send({ message: 'Logged in successfully', userId: user.id, role: user.role });
  });
});

// --- CRUD DE NOTAS ---

// Criar uma nota
app.post('/grades', (req, res) => {
  const { student_name, subject, grade, professor_id } = req.body;
  // Usando placeholders aqui, mas a arquitetura continua má
  const sql = `INSERT INTO grades (student_name, subject, grade, professor_id) VALUES (?, ?, ?, ?)`;

  // FALHA: Sem autorização. Qualquer pessoa pode criar uma nota para qualquer professor.
  db.run(sql, [student_name, subject, grade, professor_id], function(err) {
    if (err) {
      return res.status(500).send('Server error');
    }
    res.status(201).send({ id: this.lastID });
  });
});

// Obter todas as notas de um aluno
app.get('/grades/:studentName', (req, res) => {
  const sql = `SELECT * FROM grades WHERE student_name = ?`;
  db.all(sql, [req.params.studentName], (err, rows) => {
    if (err) {
      return res.status(500).send('Server error');
    }
    res.send(rows);
  });
});

// Atualizar uma nota
app.put('/grades/:id', (req, res) => {
  const { grade } = req.body;
  const sql = `UPDATE grades SET grade = ? WHERE id = ?`;

  // FALHA: Sem autorização. Qualquer pessoa pode atualizar qualquer nota.
  db.run(sql, [grade, req.params.id], function(err) {
    if (err) {
      return res.status(500).send('Server error');
    }
    res.send({ message: 'Grade updated' });
  });
});

// Apagar uma nota
app.delete('/grades/:id', (req, res) => {
  const sql = `DELETE FROM grades WHERE id = ?`;

  // FALHA: Sem autorização. Qualquer pessoa pode apagar qualquer nota.
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      return res.status(500).send('Server error');
    }
    res.send({ message: 'Grade deleted' });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

// Conexão direta com o banco de dados
const db = new sqlite3.Database('./database.db');

// Cria as tabelas se não existirem
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT, role TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS grades (id INTEGER PRIMARY KEY AUTOINCREMENT, student_name TEXT, subject TEXT, grade REAL, professor_id INTEGER)");
});

// Endpoint de Registo de Utilizador
app.post('/register', (req, res) => {
  const { email, password, role } = req.body;

  // FALHA: Vulnerabilidade de SQL Injection e guarda a senha em texto puro
  const sql = `INSERT INTO users (email, password, role) VALUES ('${email}', '${password}', '${role || 'student'}')`;

  db.run(sql, function(err) {
    if (err) {
      // Mensagem de erro genérica
      return res.status(500).send('Error registering user.');
    }
    res.status(201).send({ id: this.lastID });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json());
const db = new sqlite3.Database('./database.db');
// ... (código de criação de tabelas, register e login continua o mesmo)

// --- MANTENHA O CÓDIGO ANTERIOR ATÉ AQUI ---

// Criar uma nota (com "segurança" adicionada)
app.post('/grades', (req, res) => {
  const { student_name, subject, grade, professor_id } = req.body;

  // FALHA: Verificação manual, repetitiva e ineficiente
  db.get(`SELECT role FROM users WHERE id = ?`, [professor_id], (err, user) => {
    if (err || !user || user.role !== 'professor') {
      return res.status(403).send('Forbidden');
    }

    const sql = `INSERT INTO grades (student_name, subject, grade, professor_id) VALUES (?, ?, ?, ?)`;
    db.run(sql, [student_name, subject, grade, professor_id], function(err) {
      if (err) {
        return res.status(500).send('Server error');
      }
      res.status(201).send({ id: this.lastID });
    });
  });
});

// Obter todas as notas de um aluno (sem alterações)
app.get('/grades/:studentName', (req, res) => {
  const sql = `SELECT * FROM grades WHERE student_name = ?`;
  db.all(sql, [req.params.studentName], (err, rows) => {
    if (err) { return res.status(500).send('Server error'); }
    res.send(rows);
  });
});

// Atualizar uma nota (com "segurança" adicionada)
app.put('/grades/:id', (req, res) => {
  const { grade, professor_id } = req.body; // Supondo que o professor_id venha no corpo

  // FALHA: Código de verificação copiado e colado
  db.get(`SELECT role FROM users WHERE id = ?`, [professor_id], (err, user) => {
      if (err || !user || user.role !== 'professor') {
          return res.status(403).send('Forbidden');
      }

      const sql = `UPDATE grades SET grade = ? WHERE id = ?`;
      db.run(sql, [grade, req.params.id], function(err) {
          if (err) { return res.status(500).send('Server error'); }
          res.send({ message: 'Grade updated' });
      });
  });
});

// Apagar uma nota (com "segurança" adicionada)
app.delete('/grades/:id', (req, res) => {
    const { professor_id } = req.body; // Supondo que o professor_id venha no corpo

    // FALHA: Código de verificação copiado e colado novamente
    db.get(`SELECT role FROM users WHERE id = ?`, [professor_id], (err, user) => {
        if (err || !user || user.role !== 'professor') {
            return res.status(403).send('Forbidden');
        }

        const sql = `DELETE FROM grades WHERE id = ?`;
        db.run(sql, [req.params.id], function(err) {
            if (err) { return res.status(500).send('Server error'); }
            res.send({ message: 'Grade deleted' });
        });
    });
});

// --- COPIE O CÓDIGO DE /register e /login aqui ---
app.post('/register', (req, res) => { /* ... código do commit 2 ... */ });
app.post('/login', (req, res) => { /* ... código do commit 2 ... */ });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

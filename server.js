import 'dotenv/config'
import express from "express";
import cors from 'cors'
import bodyParser from "body-parser";
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import { db } from './lib/db.js'
import { validateItem, search } from './lib/items.js'

const app = express()
app.use(cors())
app.use(bodyParser.json());
app.use(express.static('public'))

app.use((req, res, next) => {
  console.log(chalk.gray(uuidv4()), req.method, req.url);
  next()
})

// Fotos kommen später nach Dropbox
if (process.env.DROPBOX_TOKEN) {
  console.log(chalk.green('Fotos: Dropbox verbunden'))
}

app.get('/api/items', (req, res) => {
  let items = db.prepare('select * from items').all()
  if (req.query.q) items = search(items, req.query.q)
  if (req.query.status) items = items.filter(i => i.status == req.query.status)
  res.json(_.orderBy(items, ['date', 'id'], ['desc', 'desc']))
})

app.post('/api/items', (req, res) => {
  const errors = validateItem(req.body)
  if (errors.length) return res.status(400).json({ errors })
  const info = db.prepare('insert into items (title, description, place, date) values (?, ?, ?, ?)').run(req.body.title, req.body.description || '', req.body.place, req.body.date)
  res.status(201).json(db.prepare('select * from items where id = ?').get(info.lastInsertRowid))
})

// TODO Fehlerbehandlung
app.patch('/api/items/:id', (req, res) => {
  db.prepare('update items set status = ? where id = ?').run(req.body.status, req.params.id)
  res.json(db.prepare('select * from items where id = ?').get(req.params.id))
})

app.listen(3000, () => console.log(chalk.blue("Fundbüro läuft auf http://localhost:3000")))

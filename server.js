import express from "express";
import cors from 'cors'
import bodyParser from "body-parser";
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid'

const app = express()
app.use(cors())
app.use(bodyParser.json());
app.use(express.static('public'))

app.use((req, res, next) => {
  console.log(chalk.gray(uuidv4()), req.method, req.url);
  next()
})

app.get('/api/items', (req, res) => {
  res.json([])
})

app.post('/api/items', (req, res) => {
  console.log(req.body)
  res.status(201).json(req.body)
})

app.listen(3000, () => console.log(chalk.blue("Fundbüro läuft auf http://localhost:3000")))

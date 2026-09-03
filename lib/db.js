import { DatabaseSync } from 'node:sqlite'
import { readFileSync } from 'fs'

export const db = new DatabaseSync('data/fundbuero.sqlite')

db.exec(`create table if not exists items (
  id integer primary key autoincrement,
  title text not null,
  description text not null default '',
  place text not null,
  date text not null,
  status text not null default 'gefunden' check (status in ('gefunden', 'abgeholt')),
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
)`)

// Beispieldaten beim ersten Start
if (db.prepare('select count(*) as n from items').get().n == 0) {
  const items = JSON.parse(readFileSync('data/seed.json'))
  for (const i of items) {
    db.prepare('insert into items (title, description, place, date, status) values (?, ?, ?, ?, ?)').run(i.title, i.description, i.place, i.date, i.status || 'gefunden')
  }
}

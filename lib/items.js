import moment from 'moment'
import _ from 'lodash'

export function validateItem (body) {
  const errors = []
  if (!body.title) errors.push('Bitte gib an, was gefunden wurde.')
  if (!body.place) errors.push('Bitte gib an, wo es gefunden wurde.')
  if (!moment(body.date, 'YYYY-MM-DD', true).isValid()) {
    errors.push('Bitte gib ein gültiges Funddatum an.')
  } else if (moment(body.date).isAfter(moment())) {
    errors.push('Das Funddatum darf nicht in der Zukunft liegen.')
  }
  return errors
}

export function search (items, q) {
  q = q.toLowerCase()
  return _.filter(items, i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.place.toLowerCase().includes(q))
}

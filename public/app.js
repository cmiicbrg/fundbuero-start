let showCollected = false
let query = ''

async function render() {
  console.log('render', query, showCollected)
  const res = await fetch('/api/items?q=' + encodeURIComponent(query) + (showCollected ? '' : '&status=gefunden'))
  const items = await res.json()
  let html = ''
  for (const item of items) {
    if (item.status == 'gefunden') {
      html += '<li class="item gefunden"><h3>' + item.title + '</h3>'
      if (item.description) {
        html += '<p class="muted">' + item.date + ' · ' + item.place + '</p><p>' + item.description + '</p>'
      } else {
        html += '<p class="muted">' + item.date + ' · ' + item.place + '</p>'
      }
      html += '<button onclick="collect(' + item.id + ')">Abgeholt</button></li>'
    } else {
      if (showCollected) {
        html += '<li class="item abgeholt"><h3>' + item.title + '</h3>'
        if (item.description) {
          html += '<p class="muted">' + item.date + ' · ' + item.place + '</p><p>' + item.description + '</p>'
        } else {
          html += '<p class="muted">' + item.date + ' · ' + item.place + '</p>'
        }
        html += '<span class="badge">abgeholt</span></li>'
      }
    }
  }
  document.getElementById('items').innerHTML = html
  if (items.length == 1) {
    document.getElementById('count').innerHTML = '1 Fundstück'
  } else {
    document.getElementById('count').innerHTML = items.length + ' Fundstücke'
  }
}

window.collect = async function (id) {
  await fetch('/api/items/' + id, { method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ status: 'abgeholt' }) })
  render()
}

document.getElementById('item-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(e.target))
  const res = await fetch('/api/items', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
  if (res.ok) {
    e.target.reset()
    document.getElementById('form-errors').innerHTML = ''
    render()
  } else {
    const body = await res.json()
    document.getElementById('form-errors').innerHTML = body.errors.map(e => '<li>' + e + '</li>').join('')
  }
})

document.getElementById('search').addEventListener('input', (e) => {
  query = e.target.value
  render()
})

document.getElementById('show-collected').addEventListener('change', (e) => {
  showCollected = e.target.checked
  render()
})

render()

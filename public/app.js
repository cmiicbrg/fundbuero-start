async function render() {
  const res = await fetch('/api/items')
  const items = await res.json()
  let html = ''
  for (const item of items) {
    html += '<li class="item"><h3>' + item.title + '</h3><p class="muted">' + item.date + ' · ' + item.place + '</p><p>' + item.description + '</p></li>'
  }
  document.getElementById('items').innerHTML = html
  document.getElementById('count').innerHTML = items.length + ' Fundstücke'
}

document.getElementById('item-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(e.target))
  const res = await fetch('/api/items', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
  if (res.ok) {
    e.target.reset()
    render()
  } else {
    const body = await res.json()
    document.getElementById('form-errors').innerHTML = body.errors.map(e => '<li>' + e + '</li>').join('')
  }
})

render()

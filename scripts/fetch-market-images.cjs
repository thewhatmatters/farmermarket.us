const API_KEY = process.env.GOOGLE_MAPS_API_KEY
const DATA_FILE = '/Users/jax/Development/farmermarket.us/src/lib/data/resources.json'
const IMAGES_DIR = '/Users/jax/Development/farmermarket.us/static/images/resources'

if (!API_KEY) { console.error('Error: GOOGLE_MAPS_API_KEY not set'); process.exit(1) }

const fs = require('fs')
const path = require('path')

const resources = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
const stateFilter = process.argv[2]
const markets = stateFilter ? resources.filter(r => r.address.state.toLowerCase() === stateFilter.toLowerCase()) : resources

console.log('Found ' + markets.length + ' markets' + (stateFilter ? ' in ' + stateFilter : ''))

async function searchPlace(query) {
  const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?key=' + API_KEY + '&query=' + encodeURIComponent(query)
  try {
    const response = await fetch(url)
    const data = await response.json()
    if (data.status === 'ZERO_RESULTS') return null
    if (data.status !== 'OK') { console.error('  Search error: ' + data.status); return null }
    return data.results[0]
  } catch (err) { console.error('  Search failed: ' + err.message); return null }
}

function getPhotoUrl(photoReference, maxWidth) { maxWidth = maxWidth || 800; return 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=' + maxWidth + '&photo_reference=' + photoReference + '&key=' + API_KEY }

async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url, { redirect: 'follow' })
    if (!response.ok) return false
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.startsWith('image/')) return false
    const buffer = await response.arrayBuffer()
    fs.writeFileSync(filepath, Buffer.from(buffer))
    return true
  } catch (err) { return false }
}

async function processMarket(market) {
  const state = market.address.state.toLowerCase().replace(/\s+/g, '-')
  const stateDir = path.join(IMAGES_DIR, state)
  if (!fs.existsSync(stateDir)) fs.mkdirSync(stateDir, { recursive: true })
  
  const filename = market.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.jpg'
  const filepath = path.join(stateDir, filename)
  
  if (fs.existsSync(filepath)) { console.log('  OK: ' + market.title + ' - already exists'); return true }
  
  const query = market.title + ', ' + market.address.city + ', ' + market.address.state
  console.log('  Searching: ' + market.title + '...')
  
  const place = await searchPlace(query)
  if (!place || !place.photos || place.photos.length === 0) { console.log('  FAIL: ' + market.title + ' - no photos'); return false }
  
  const photoRef = place.photos[0].photo_reference
  const photoUrl = getPhotoUrl(photoRef)
  const success = await downloadImage(photoUrl, filepath)
  
  if (success) { market.image = '/images/resources/' + state + '/' + filename; console.log('  OK: ' + market.title + ' - saved'); return true }
  else { console.log('  FAIL: ' + market.title + ' - download failed'); return false }
}

async function main() {
  console.log('Processing ' + markets.length + ' markets...\n')
  let successCount = 0, failCount = 0
  for (const market of markets) { const result = await processMarket(market); if (result) successCount++; else failCount++; await new Promise(r => setTimeout(r, 100)) }
  fs.writeFileSync(DATA_FILE, JSON.stringify(resources, null, 2))
  console.log('\nDone! ' + successCount + ' success, ' + failCount + ' failed')
}
main()

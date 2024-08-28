// server/api/buildings.get.js
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const filePath = path.resolve('data', 'buildings.json')
    const data = fs.readFileSync(filePath, 'utf8')
    const buildings = JSON.parse(data)
    return { buildings }
  } catch (error) {
    return { error: 'Internal Server Error' }
  }
})

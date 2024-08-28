// server/api/buildings.put.js
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'PUT') {
    try {
      // Lấy dữ liệu từ body
      const body = await readBody(event)
      
      // Xác định đường dẫn file JSON
      const filePath = path.resolve('data', 'buildings.json')

      // Đọc file hiện có
      const data = fs.readFileSync(filePath, 'utf8')
      const buildings = JSON.parse(data)

      // Tìm và cập nhật tòa nhà
      const buildingIndex = buildings.findIndex(b => b.id === body.id)
      if (buildingIndex !== -1) {
        buildings[buildingIndex] = { ...buildings[buildingIndex], ...body }

        // Ghi lại dữ liệu đã cập nhật vào file
        fs.writeFileSync(filePath, JSON.stringify(buildings, null, 2))

        // Trả về phản hồi thành công
        return { message: 'Data updated successfully' }
      } else {
        return { error: 'Building not found' }
      }
    } catch (error) {
      return { error: 'Internal Server Error' }
    }
  } else {
    // Chỉ cho phép phương thức PUT
    event.node.res.setHeader('Allow', ['PUT'])
    return { error: `Method ${event.node.req.method} Not Allowed` }
  }
})

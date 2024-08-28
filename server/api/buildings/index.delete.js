// server/api/buildings.delete.js
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'DELETE') {
    try {
      // Lấy ID từ query params
      const { id } = getQuery(event)

      if (!id) {
        return { error: 'ID is required' }
      }

      // Xác định đường dẫn file JSON
      const filePath = path.resolve('data', 'buildings.json')

      // Đọc file hiện có
      const data = fs.readFileSync(filePath, 'utf8')
      const buildings = JSON.parse(data)

      // Lọc để giữ lại các tòa nhà không trùng ID cần xóa
      const filteredBuildings = buildings.filter(b => b.id !== Number(id))

      // Ghi dữ liệu đã được xóa vào file
      fs.writeFileSync(filePath, JSON.stringify(filteredBuildings, null, 2))

      // Trả về phản hồi thành công
      return { message: 'Data deleted successfully' }
    } catch (error) {
      return { error: 'Internal Server Error' }
    }
  } else {
    // Chỉ cho phép phương thức DELETE
    event.node.res.setHeader('Allow', ['DELETE'])
    return { error: `Method ${event.node.req.method} Not Allowed` }
  }
})

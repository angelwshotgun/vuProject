// server/api/buildings.post.js
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'POST') {
    try {
      // Lấy dữ liệu từ body
      const body = await readBody(event)
  
      // Xác định đường dẫn file JSON
      const filePath = path.resolve('data', 'buildings.json')

      // Lưu dữ liệu vào file
      fs.writeFileSync(filePath, JSON.stringify(body, null, 2))

      // Trả về phản hồi thành công
      return { message: 'Data saved successfully' }
    } catch (error) {
      // Trả về lỗi
      return { error: 'Internal Server Error' }
    }
  } else {
    // Chỉ cho phép phương thức POST
    event.node.res.setHeader('Allow', ['POST'])
    return { error: `Method ${event.node.req.method} Not Allowed` }
  }
})

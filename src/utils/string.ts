
// 将 SVG 转换为 Base64
export function svgToBase64(svgString: string) {
  // 使用 TextEncoder 处理 Unicode 字符
  const encoder = new TextEncoder()
  const data = encoder.encode(svgString)

  // 将 Uint8Array 转换为 Base64
  let binary = ''
  const bytes = new Uint8Array(data)
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!)
  }

  return `data:image/svg+xml;base64,${btoa(binary)}`
}

// 新增：SVG Base64 转 PNG Base64
export async function svgBase64ToPngBase64(
  svgBase64: string,
  options: {
    scale?: number
    backgroundColor?: string
    quality?: number
  } = {},
): Promise<string> {
  const { scale = 20, backgroundColor = 'white', quality = 1.0 } = options

  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('无法获取 Canvas 上下文'))
          return
        }

        // 设置 Canvas 尺寸
        canvas.width = img.width * scale
        canvas.height = img.height * scale

        // 设置背景色
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 高质量渲染
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // 绘制图像
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // 转换为 PNG Base64
        const pngBase64 = canvas.toDataURL('image/png', quality)
        resolve(pngBase64)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error('SVG 图片加载失败'))
    }

    img.src = svgBase64
  })
}

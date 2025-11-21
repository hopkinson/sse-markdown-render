export async function copyTextToClipboard(data: string | Blob) {
  try {
    if (typeof data === 'string') {
      // 文本处理
      await navigator.clipboard.writeText(data)
    } else {
      // 图片或其他二进制数据处理
      const clipboardItem = new ClipboardItem({
        [data.type]: data,
      })
      await navigator.clipboard.write([clipboardItem])
    }
    return Promise.resolve(true)
  } catch (error) {
    // 备选方案仅支持文本
    if (typeof data !== 'string') {
      return Promise.resolve(false)
    }
    const textarea = document.createElement('textarea')
    textarea.value = data
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    textarea.style.pointerEvents = 'none'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      const successful = document.execCommand('copy')
      return Promise.resolve(successful)
    } catch (err) {
      return Promise.resolve(false)
    } finally {
      document.body.removeChild(textarea)
    }
  }
}


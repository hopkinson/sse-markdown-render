import { h, type VNode } from 'vue'
import MMath from '../components/Math.vue'
import MCode from '../components/Code.vue'
import MSub from '../components/Sub.vue'
import type { Nodes, Root, Element, Text } from 'hast'
import MMermaid from '../components/Mermaid.vue'

interface TextPart {
  type: 'text' | 'wiki'
  content: string
}
const processedParts = (text: string): TextPart[] => {
  const regex = /(\[\[\d+\]\])/g
  const parts = text.split(regex)
  const result: TextPart[] = []
  parts.forEach((part) => {
    if (!part) return
    const match = part.match(/\[\[(\d+)\]\]/)
    if (match) {
      result.push({
        type: 'wiki',
        content: match[1]||'',
      })
    } else {
      result.push({
        type: 'text',
        content: part,
      })
    }
  })

  return result
}

/**
 * 提取节点中的文本内容
 * @param {Nodes} node - 节点对象
 * @returns {string} 提取的文本内容
 */
export function extractTextFromNode(node: Nodes): string {
  if (node.type === 'text') return (node as Text).value
  if ('children' in node && node.children) {
    return node.children.map((child) => extractTextFromNode(child)).join('')
  }
  return ''
}

/**
 * 将 hast 节点转换为 Vue h 函数
 * @param {Nodes} node - hast节点
 * @param {Message} message - 消息体
 * @returns {VNode|Array<VNode>|string|null} Vue组件或文本
 */
export function hastToVue(
  node: Nodes,
  preview?: boolean,
): VNode | Array<VNode | string> | string | null {
  if (node.type === 'text') {
    const list = processedParts(node.value)
    const data = list.map(({ type, content }) => {
      if (type === 'wiki') {
        return h(MSub, { number: parseInt(content) })
      } else {
        return content
      }
    })
    return data
  }

  // 处理元素节点
  if (node.type === 'element') {
    const elementNode = node as Element
    const { tagName, properties = {}, children = [] } = elementNode

    // 处理行内公式
    if (
      Array.isArray(properties.className) &&
      properties.className.some((i) => i === 'math-inline')
    ) {
      const mathText = extractTextFromNode(node)
      return h(MMath, {
        value: mathText,
        inline: true,
      })
    }

    // 块级数学公式
    if (
      Array.isArray(properties.className) &&
      properties.className.some((i) => i === 'math-inline')
    ) {
      const mathText = extractTextFromNode(node)
      return h(MMath, {
        value: mathText,
        inline: true,
      })
    }
    // 检查是否是数学公式
    if (
      Array.isArray(properties.className) &&
      properties.className.some((i) => i === 'math-display')
    ) {
      const mathText = extractTextFromNode(node)
      return h(MMath, {
        value: mathText,
        inline: false,
      })
    }

    if (tagName === 'pre') {
      const codeNode = children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code',
      )
      if (codeNode) {
        const codeText = extractTextFromNode(codeNode)

        const languageClass = Array.isArray(codeNode.properties?.className)
          ? codeNode.properties.className.find(
              (cls) => typeof cls === 'string' && cls.startsWith('language-'),
            )
          : null
        const language = languageClass ? (languageClass as string).replace('language-', '') : ''
        // 检查是否是Mermaid
        if (language === 'mermaid') {
          return h(MMermaid, {
            value: codeText,
            preview,
          })
        }
        // 普通代码块
        else {
          return h(MCode, {
            code: codeText,
            language: language,
          })
        }
      }
    }
    // 递归处理子节点
    const childNodes = children
      .map((child) => hastToVue(child))
      .filter((child): child is VNode | string => child !== null) as Array<VNode | string>

    return h(tagName, properties, childNodes)
  }

  // 处理根节点
  if (node.type === 'root') {
    const rootNode = node as Root
    return h(
      'div',
      {},
      (rootNode.children
        ?.map((child) => hastToVue(child))
        .filter((child): child is VNode | string => child !== null) as Array<VNode | string>) || [],
    )
  }

  return null
}

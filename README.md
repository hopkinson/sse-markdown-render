# 基于mdast实现流式输出渲染markdown

> 解决流式输出使用 v-html 渲染无法选中文字的问题。通过 mdast 实现流式输出渲染 Markdown，提供更好的文本选择和交互体验。

## 特性

- 支持代码显示和负责，
- 集成 Mermaid 流程图、脑图等图表渲染和下载
- KaTeX 数学公式渲染，
- Wiki链接显示 （基于antd UI库，可以自行更换，目前主要是为了Wiki链接实现引用，可以替换为 Popper.js 框架）
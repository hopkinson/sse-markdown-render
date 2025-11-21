<template>
  <component :is="renderedContent" />
</template>

<script lang="ts" setup>
import { toHast } from "mdast-util-to-hast";
import { ref, h, watch, type VNode, type Component } from "vue";
import { math } from "micromark-extension-math";
import { fromMarkdown } from "mdast-util-from-markdown";
import { mathFromMarkdown } from "mdast-util-math";
import { gfmTableFromMarkdown } from "mdast-util-gfm-table";
import { gfmTable } from "micromark-extension-gfm-table";
import { gfm } from "micromark-extension-gfm";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { hastToVue } from "../utils/hast-converter";
import type { Element } from "hast";

const { content } = defineProps<{
  content: string;
}>();

const renderedContent = ref<Component | VNode | VNode[] | string | null>(null);
watch(
  () => content,
  (newVal) => {
    if (!newVal) {
      renderedContent.value = null;
      return;
    }
    // 公式显示转换除去多余字符
    newVal = newVal.replace(/\\\( *(.*?) *\\\)/g, "$$$1$$");
    //value = value.replace(/\\\((.*?)\\\)/g, '$$$1$$');
    newVal = newVal.replace(/\\\[ *(.*?) *\\\]/g, "$$$$$1$$$$");
    newVal = newVal.replace(/\\\[/g, "$$$$");
    newVal = newVal.replace(/\\\[/g, "$$$$");
    newVal = newVal.replace(/\\\]/g, "$$$$");
    try {
      const mdast = fromMarkdown(newVal ?? "", {
        extensions: [gfm(), math(), gfmTable()],
        mdastExtensions: [
          gfmFromMarkdown(),
          mathFromMarkdown(),
          gfmTableFromMarkdown(),
        ],
      });

      const hast = toHast(mdast, {
        handlers: {
          inlineMath(state, node) {
            return {
              type: "element",
              tagName: "span",
              properties: { className: ["math", "math-inline"] },
              children: [{ type: "text", value: node.value }],
            };
          },
          math(state, node) {
            return {
              type: "element",
              tagName: "div",
              properties: { className: ["math", "math-display"] },
              children: [{ type: "text", value: node.value }],
            };
          },
          link(state, node) {
            const result: Element = {
              type: "element",
              tagName: "a",
              properties: {
                href: node.url,
                target: "_blank",
                rel: "noopener noreferrer",
              },
              children: state.all(node),
            };
            state.patch(node, result);
            return state.applyData(node, result);
          },
        },
      });
      const vueComponent = hastToVue(hast);
      renderedContent.value = vueComponent;
    } catch (error) {
      console.error("解析 markdown 时出错:", error);
      renderedContent.value = h(
        "div",
        { style: "color: red;" },
        `解析错误: ${(error as Error).message}`
      );
    }
  },
  { immediate: true }
);
</script>

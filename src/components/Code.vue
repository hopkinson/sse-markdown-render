<template>
  <div class="bg-#F3F4F6 my-3" :class="`language-${language}`">
    <div
      class="flex justify-between items-center text-xs px-3 py-2 sticky top-0 bg-#F3F4F6 overflow-hidden"
    >
      <span>{{ language || "plaintext" }}</span>
      <div
        @click="handleCopy"
        class="cursor-pointer rounded-lg transition-all flex items-center px-1 py-0.5 text-#8D8D8D justify-center hover:bg-black/5 code-copy__btn"
      >
        <SvgIcon name="message-copy" class="w-5 h-5 text-#8D8D8D" />
        复制
      </div>
    </div>
    <pre class="px-4 pt-3 overflow-x-auto m-0">
        <code class="text-sm leading-relaxed" v-html="highlightedCode"></code>
    </pre>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import hljs from "highlight.js";
import { copyTextToClipboard } from "../utils/clipboard";
import "highlight.js/styles/github.min.css";
import { message } from "ant-design-vue";

const { code, language } = defineProps<{
  language: string;
  code: string;
}>();

hljs.configure({
  ignoreUnescapedHTML: true,
});

// 计算高亮代码
const highlightedCode = computed(() => {
  if (language && hljs.getLanguage(language)) {
    try {
      return hljs.highlight(code, { language }).value;
    } catch (e) {
      return hljs.highlightAuto(code).value;
    }
  } else {
    return hljs.highlightAuto(code).value;
  }
});

async function handleCopy() {
  try {
    await copyTextToClipboard(code);
    message.success("复制成功");
  } catch (e) {
    message.success("复制失败");
  }
}
</script>

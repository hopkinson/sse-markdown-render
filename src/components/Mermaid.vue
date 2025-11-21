<template>
  <div class="relative group/mermaid">
    <div
      v-if="!preview"
      class="flex justify-end items-center text-xs px-3 py-2 gap-2 sticky top-0 bg-#F3F4F6 mermaid-operation"
    >
      <div
        @click="handlePreview(true)"
        class="cursor-pointer transition-all flex items-center px-1 py-0.5 text-#8D8D8D justify-center rounded-lg hover:bg-black/5"
      >
        <div class="i-mingcute:search-line w-4 h-4 text-#8D8D8D"></div>
        预览
        <a-image
          :width="0"
          class="hidden"
          :preview="{
            visible,
            onVisibleChange: handlePreview,
          }"
          :src="previewSvg"
        />
      </div>
      <div
        @click="handleDownload"
        class="cursor-pointer transition-all flex items-center px-1 py-0.5 text-#8D8D8D justify-center rounded-lg hover:bg-black/5"
      >
        <div class="i-mingcute:download-2-line w-4 h-4 text-#8D8D8D"></div>
        下载
      </div>
    </div>
    <div
      v-html="svgHtml"
      ref="mermaidRef"
      :class="[preview ? 'h-auto' : 'h-[40vh]']"
      class="mermaid language-mermaid bg-#F3F4F6 max-w-full p-3 overflow-auto"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import mermaid from "mermaid";
import { throttle } from "ts-debounce-throttle";
import { svgToBase64, svgBase64ToPngBase64 } from "../utils/string";

const { value, preview } = defineProps<{
  preview?: boolean;
  value: string;
}>();

mermaid.initialize({
  startOnLoad: false,
  suppressErrorRendering: true,
  securityLevel: "loose",
});

const svgHtml = ref("");
const previewSvg = ref("");

const renderId = `mermaid-${Date.now()}`;
const mermaidRef = ref<HTMLElement>();
const visible = ref<boolean>(false);

const renderMermaid = async () => {
  try {
    const data = await mermaid.parse(value, { suppressErrors: true });
    if (data) {
      const { svg } = await mermaid.render(renderId, value, mermaidRef.value);
      svgHtml.value = svg;
    }
  } catch (error) {
    console.log(error);
  }
};

async function handlePreview(value: boolean) {
  if (!mermaidRef.value) return;
  visible.value = value;
  const svgbase64 = await svgToBase64(svgHtml.value);
  previewSvg.value = value ? svgbase64 : "";
}

async function handleDownload() {
  const svgbase64 = await svgToBase64(svgHtml.value);
  const image = await svgBase64ToPngBase64(svgbase64);
  const response = await fetch(image);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const imageBlob = await response.blob();
  const url = window.URL.createObjectURL(imageBlob);
  const link = document.createElement("a");
  link.download = `${renderId}.png`;
  link.href = url;
  link.click();
}

watch(() => value, throttle(renderMermaid, 1000));
onMounted(renderMermaid);
</script>
<style scoped>
.mermaid :deep(svg) {
  max-width: 100% !important;
  height: 100%;
}
</style>

<template>
  <div class="inline-block md-sub mx-0.5">
    <a-popover
      :getPopupContainer="(triggerNode) => triggerNode.parentElement!"
      trigger="click"
      title="标题"
      :arrow="false"
    >
      <template #content>
        <div class="max-h-50 overflow-auto max-w-200">
          <Markdown class="!text-sm"  :content="''"></Markdown>
        </div>
      </template>
      <div
        class="rounded-full bg-#999999 w-4 h-4 inline-flex hover:brightness-85 items-center justify-center text-white align-top decoration-none text-xs leading-none cursor-pointer"
      >
        <span class="inline-block scale-85 origin-center">{{ number }}</span>
      </div>
    </a-popover>
  </div>
</template>

<script setup lang="ts">
import Markdown from './Markdown.vue';
const {  number } = defineProps<{
  number: number
}>()


</script>

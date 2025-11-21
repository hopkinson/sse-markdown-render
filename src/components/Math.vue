<template>
  <span v-if="inline" class="math-inline" v-html="renderedMath" />
  <div v-else class="math-display" v-html="renderedMath" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import katex from "katex";
import "katex/dist/katex.min.css";

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  inline: {
    type: Boolean,
    default: false,
  },
});

const renderedMath = ref("");

renderedMath.value = katex.renderToString(props.value, {
  displayMode: !props.inline,
  throwOnError: false,
  errorColor: "#cc0000",
});
</script>

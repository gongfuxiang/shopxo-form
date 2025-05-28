<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <div class="content w flex-row" :style="common_store.frame_style + 'height: 100%;' + line_location">
                <div :style="border_style"></div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { commonStore } from "@/store";
const common_store = commonStore();
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});
const form = computed(() => props.value);
const line_location = computed(() => `justify-content: ${ form.value.line_location };`);
// 用于样式显示
const border_style = computed(() => `width: ${ form.value.line_width }%;border-bottom: ${ form.value.line_size }px ${ form.value.line_style } ${ form.value.line_color };`);
</script>
<style lang="scss" scoped>
.rich-text-content {
    position: relative;
    z-index: 999;
    .editor {
        position: relative;
        height: 30rem !important;
        overflow-y: hidden;
        * {
            max-width: 100%;
        }
    }
}
</style>

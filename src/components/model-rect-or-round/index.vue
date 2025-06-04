<template>
    <div class="rendering-area w h pa-3">
        <div class="w h" :style="border_style"></div>
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
    isCustom: {
        type: Boolean,
        default: false,
    }
});
const form = computed(() => props.value);
const border_style = computed(() => `${ form.value.type == 'rect' ? '' : 'border-radius: 50%;'}border: ${ form.value.border_size }px ${ form.value.border_type } ${ form.value.border_color};`);
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

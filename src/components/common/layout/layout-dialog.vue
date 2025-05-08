<template>
    <el-dialog v-model="dialogVisible" :title="title" :close-on-press-escape="false" :close-on-click-modal="true" :append-to-body="false" :before-close="handleClose">
        <slot></slot>
    </el-dialog>
</template>
<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        default: '编辑自定义',
    }
});
const dialogVisible = defineModel('visible', { type: Boolean, default: false });
const emit = defineEmits(['handleClose']);
const handleClose = () => {
    dialogVisible.value = false;
    emit('handleClose');
};
</script>

<style lang="scss" scoped></style>

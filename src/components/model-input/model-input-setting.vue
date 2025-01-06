<template>
    <el-form :model="form" label-width="80" label-position="left">
        <div class="mb-10 fw">内容设置</div>
        <el-input v-model="form.title" placeholder="请输入内容"></el-input>
    </el-form>
</template>
<script setup lang="ts">
/**
 * @description: 单行文本 （设置）
 * @param value{Object} 传过来的数据，用于数据渲染
 */
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});
const form = ref(props.value);
</script>

<template>
    <div class="input">
        <div class="form-group">
            <div class="label">单行文本</div>
            <div class="content">
                <el-input v-model="input_value" placeholder="请输入内容"></el-input>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
/**
 * @description: 视频 （渲染）
 * @param value{Object} 传过来的数据，用于数据渲染
 */
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});
const input_value = ref('');
// 监听数据变化
watch(
    props.value,
    (newVal, oldValue) => {
        // const new_content = newVal || {};
        input_value.value = newVal.title || '';
    },
    { immediate: true, deep: true }
);
</script>
<style lang="scss" scoped>
.content {
    pointer-events: none;
}
</style>

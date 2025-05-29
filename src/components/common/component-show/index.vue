<template>
    <!-- 单行文本 | 下拉框 | 单选按钮组-->
    <template v-if="['single-text', 'select', 'radio-btns'].includes(form.key)">
        <model-input :value="form.com_data"></model-input>
    </template>
    <!-- 多行文本 -->
    <template v-if="form.key == 'multi-text'">
        <model-multi-text :value="form.com_data"></model-multi-text>
    </template>
    <!-- 数字 -->
    <template v-if="form.key == 'number'">
        <model-number :value="form.com_data"></model-number>
    </template>
    <!-- 日期时间 -->
    <template v-if="form.key == 'date'">
        <model-date :value="form.com_data"></model-date>
    </template>
    <!-- 日期时间 -->
    <template v-if="form.key == 'date-group'">
        <model-date-group :value="form.com_data"></model-date-group>
    </template>
    <!-- 多选按钮组 ｜ 下拉复选框 -->
    <template v-if="['checkbox', 'select-multi'].includes(form.key)">
        <model-checkbox :value="form.com_data"></model-checkbox>
    </template>
    <!-- 定位 -->
    <template v-if="form.key == 'position'">
        <model-position :value="form.com_data"></model-position>
    </template>
    <!-- 富文本 -->
    <template v-if="form.key == 'rich-text'">
        <model-rich-text :value="form.com_data"></model-rich-text>
    </template>
    <!-- 地址 -->
    <template v-if="form.key == 'address'">
        <model-address :value="form.com_data"></model-address>
    </template>
    <!-- 手机 -->
    <template v-if="form.key == 'phone'">
        <model-phone :value="form.com_data"></model-phone>
    </template>
    <!-- 密码 -->
    <template v-if="form.key == 'pwd'">
        <model-pwd :value="form.com_data"></model-pwd>
    </template>
    <!-- 评分 -->
    <template v-if="form.key == 'score'">
        <model-score :value="form.com_data"></model-score>
    </template>
    <!-- 辅助线 -->
    <template v-if="form.key == 'auxiliary-line'">
        <model-auxiliary-line :value="form.com_data"></model-auxiliary-line>
    </template>
    <!-- 上传图片｜上传视频 ｜ 上传文件 -->
    <template v-if="['upload-img', 'upload-video', 'upload-attachments'].includes(form.key)">
        <model-upload :value="form.com_data" :accept-type="form.key == 'upload-img' ? 'img' : form.key == 'upload-video' ? 'video' : 'file'"></model-upload>
    </template>
    <!-- 文本 -->
    <template v-if="form.key == 'text'">
        <model-text :value="form.com_data"></model-text>
    </template>
    <!-- 图片 -->
    <template v-if="form.key == 'img'">
        <model-img :value="form.com_data"></model-img>
    </template>
    <!-- 视频 -->
    <template v-if="form.key == 'video'">
        <model-video :value="form.com_data"></model-video>
    </template>
    <!-- 文件 -->
    <template v-if="form.key == 'attachments'">
        <model-attachments :value="form.com_data"></model-attachments>
    </template>
</template>

<script lang="ts" setup>
const props = defineProps({
    value: {
        type: Object,
        default: () => {},
    },
})

const form = ref(props.value);
watch(() => props.value, (val) => {
    form.value = val;
})
</script>

<style lang="less" scoped>
</style>
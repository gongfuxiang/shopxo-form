<template>
    <!-- 单行文本 | 下拉框 | 单选按钮组-->
    <template v-if="['single-text', 'select', 'radio-btns'].includes(form.key)">
        <model-input :value="form.com_data" :is-custom="isCustom"></model-input>
    </template>
    <!-- 多行文本 -->
    <template v-if="form.key == 'multi-text'">
        <model-multi-text :value="form.com_data" :is-custom="isCustom"></model-multi-text>
    </template>
    <!-- 数字 -->
    <template v-if="form.key == 'number'">
        <model-number :value="form.com_data" :is-custom="isCustom"></model-number>
    </template>
    <!-- 日期时间 -->
    <template v-if="form.key == 'date'">
        <model-date :value="form.com_data" :is-custom="isCustom"></model-date>
    </template>
    <!-- 日期时间 -->
    <template v-if="form.key == 'date-group'">
        <model-date-group :value="form.com_data" :is-custom="isCustom"></model-date-group>
    </template>
    <!-- 多选按钮组 ｜ 下拉复选框 -->
    <template v-if="['checkbox', 'select-multi'].includes(form.key)">
        <model-checkbox :value="form.com_data" :is-custom="isCustom"></model-checkbox>
    </template>
    <!-- 定位 -->
    <template v-if="form.key == 'position'">
        <model-position :value="form.com_data" :is-custom="isCustom"></model-position>
    </template>
    <!-- 富文本 -->
    <template v-if="form.key == 'rich-text'">
        <model-rich-text :value="form.com_data" :is-custom="isCustom"></model-rich-text>
    </template>
    <!-- 地址 -->
    <template v-if="form.key == 'address'">
        <model-address :value="form.com_data" :is-custom="isCustom"></model-address>
    </template>
    <!-- 手机 -->
    <template v-if="form.key == 'phone'">
        <model-phone :value="form.com_data" :is-custom="isCustom"></model-phone>
    </template>
    <!-- 密码 -->
    <template v-if="form.key == 'pwd'">
        <model-pwd :value="form.com_data" :is-custom="isCustom"></model-pwd>
    </template>
    <!-- 评分 -->
    <template v-if="form.key == 'score'">
        <model-score :value="form.com_data" :is-custom="isCustom"></model-score>
    </template>
    <!-- 子表单 -->
    <template v-if="form.key == 'subform'">
        <model-subform :value="form.com_data" :is-custom="isCustom" :is-preview="isPreview"></model-subform>
    </template>
    <!-- 上传图片｜上传视频 ｜ 上传文件 -->
    <template v-if="['upload-img', 'upload-video', 'upload-attachments'].includes(form.key)">
        <model-upload :value="form.com_data" :is-custom="isCustom" :accept-type="form.key == 'upload-img' ? 'img' : form.key == 'upload-video' ? 'video' : 'file'"></model-upload>
    </template>
    <!-- 辅助线 -->
    <template v-if="form.key == 'auxiliary-line'">
        <model-auxiliary-line :value="form.com_data" :is-custom="isCustom"></model-auxiliary-line>
    </template>
    <!-- 文本 -->
    <template v-if="form.key == 'text'">
        <model-text :value="form.com_data" :is-custom="isCustom"></model-text>
    </template>
    <!-- 图片 -->
    <template v-if="form.key == 'img'">
        <model-img :value="form.com_data" :is-custom="isCustom"></model-img>
    </template>
    <!-- 视频 -->
    <template v-if="form.key == 'video'">
        <model-video :value="form.com_data" :is-custom="isCustom"></model-video>
    </template>
    <!-- 文件 -->
    <template v-if="form.key == 'attachments'">
        <model-attachments :value="form.com_data" :is-custom="isCustom"></model-attachments>
    </template>
    <!-- 矩形 | 圆形 -->
    <template v-if="['rect', 'round'].includes(form.key)">
        <model-rect-or-round :value="form.com_data" :is-custom="isCustom"></model-rect-or-round>
    </template>
</template>

<script lang="ts" setup>
const props = defineProps({
    value: {
        type: Object,
        default: () => {},
    },
    isCustom: {
        type: Boolean,
        default: false,
    },
    isPreview: {
        type: Boolean,
        default: false,
    }
})

const form = ref(props.value);
watch(() => props.value, (val) => {
    form.value = val;
})
</script>

<style lang="less" scoped>
</style>
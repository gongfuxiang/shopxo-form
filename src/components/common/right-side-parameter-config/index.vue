<template>
    <div class="setting-content">
        <!-- 单行文本 | 下拉框 | 单选按钮组-->
        <template v-if="['single-text', 'select', 'radio-btns'].includes(model_value.key)">
            <model-input-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-input-setting>
        </template>
        <!-- 多行文本 -->
        <template v-else-if="model_value.key == 'multi-text'">
            <model-textarea-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-textarea-setting>
        </template>
        <!-- 数字 -->
        <template v-else-if="model_value.key == 'number'">
            <model-number-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-number-setting>
        </template>
        <!-- 日期时间 -->
        <template v-else-if="model_value.key == 'date'">
            <model-date-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-date-setting>
        </template>
        <!-- 日期时间组 -->
        <template v-else-if="model_value.key == 'date-group'">
            <model-date-group-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-date-group-setting>
        </template>
        <!-- 多选按钮组 ｜ 下拉复选框 -->
        <template v-else-if="['checkbox', 'select-multi'].includes(model_value.key)">
            <model-checkbox-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-checkbox-setting>
        </template>
        <!-- 定位 -->
        <template v-else-if="model_value.key == 'position'">
            <model-position-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-position-setting>
        </template>
        <!-- 富文本 -->
        <template v-else-if="model_value.key == 'rich-text'">
            <model-rich-text-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-rich-text-setting>
        </template>
        <!-- 地址 -->
        <template v-else-if="model_value.key == 'address'">
            <model-address-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-address-setting>
        </template>
        <!-- 手机 -->
        <template v-else-if="model_value.key == 'phone'">
            <model-phone-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-phone-setting>
        </template>
        <!-- 密码 -->
        <template v-else-if="model_value.key == 'pwd'">
            <model-pwd-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-pwd-setting>
        </template>
        <!-- 评分 -->
        <template v-else-if="model_value.key == 'score'">
            <model-score-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-score-setting>
        </template>
        <!-- 上传图片｜上传视频 ｜ 上传文件 -->
        <template v-else-if="['upload-img', 'upload-video', 'upload-attachments'].includes(model_value.key)">
            <model-upload-setting :value="model_value.com_data" :model-id="model_value.id" :accept-type="model_value.key == 'upload-img' ? 'img' : model_value.key == 'upload-video' ? 'video' : 'file'" :is-custom="isCustom"></model-upload-setting>
        </template>
        <!-- 子表单 -->
        <template v-else-if="model_value.key == 'subform'">
            <model-subform-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-subform-setting>
        </template>
        <!-- 辅助线 -->
        <template v-else-if="model_value.key == 'auxiliary-line'">
            <model-auxiliary-line-setting :value="model_value" :model-id="model_value.id" :is-custom="isCustom"></model-auxiliary-line-setting>
        </template>
        <!-- 文本 -->
        <template v-else-if="model_value.key == 'text'">
            <model-text-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-text-setting>
        </template>
        <!-- 图片 -->
        <template v-else-if="model_value.key == 'img'">
            <model-img-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-img-setting>
        </template>
        <!-- 视频 -->
        <template v-else-if="model_value.key == 'video'">
            <model-video-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-video-setting>
        </template>
        <!-- 视频 -->
        <template v-else-if="model_value.key == 'attachments'">
            <model-attachments-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-attachments-setting>
        </template>
        <!-- 矩形 | 圆形 -->
        <template v-else-if="['rect', 'round'].includes(model_value.key)">
            <model-rect-or-round-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-rect-or-round-setting>
        </template>
        <template v-else>
            <div class="pa-16 cr-6 mt-40 pt-40 tc">暂无设置</div>
        </template>
    </div>
</template>

<script setup lang="ts"> 
const props = defineProps({
    isCustom: {
        type: Boolean,
        default: false
    }
});
const model_value = defineModel({ type: Object, default: () => ({}) });
</script>

<template>
    <div class="dialog-main-header">
        <template v-if="config_value.heading_type == 'img' && config_value.heading_image.length > 0">
            <image-empty v-model="config_value.heading_image[0]" error-style="width:100%;height:3.2rem;"></image-empty>
        </template>
        <template v-else-if="!isEmpty(config_value.heading_color)">
            <div :style="`height:3.2rem;width:100%;background:${ config_value.heading_color }`"></div>
        </template>
        <div v-if="config_value.is_show_heading_title == '1'" class="head-title flex-row" :style="heading_title_style">{{ common_store.form_model_config.name }}</div>
    </div>
</template>

<script lang="ts" setup>
import { commonStore } from "@/store";
import { isEmpty } from "@/utils";
const common_store = commonStore();

const config_type = defineModel({ type: String, default: () => 'computer' });
// 配置信息，区分是手机端数据还是电脑端数据
const config_value = computed(() => config_type.value == 'computer' ? common_store.form_config.style_settings.computer : common_store.form_config.style_settings.mobile);
// 表单名称的样式
const heading_title_style = computed(() => {
    const { heading_title_location, heading_title_color, heading_title_size, heading_title_font_weight } = config_value.value;
    return `justify-content:${ heading_title_location };color:${ heading_title_color };font-size:${ heading_title_size }px;font-weight:${ heading_title_font_weight };`
})
</script>

<style lang="scss" scoped>
.head-title { 
    word-wrap: break-word;
    font-size: 20px;
    padding: 18px 30px 0;
    word-break: break-word;
}
</style>
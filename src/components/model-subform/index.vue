<template>
    <div class="rendering-area">
        <div class="form-group flex-col gap-10">
            <form-title :value="props.value" :is-subform="true"></form-title>
            <div class="content w">
                <template v-if="children.length > 0">
                    <subform-handle :key="get_math" :value="form" :is-preview="isPreview" :custom-height="custom_height"></subform-handle>
                    <form-error v-if="form.common_config.is_error == '1'" v-model="form.common_config.error_text"></form-error>
                </template>
                <template v-else>
                    <div class="subform-data">暂无可用字段</div>
                </template>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { commonStore } from "@/store";
import { get_math } from "@/utils";
const common_store = commonStore();
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    isCustom: {
        type: Boolean,
        default: false,
    },
    isPreview: {
        type: Boolean,
        default: false,
    },
});
const form = computed(() => props.value);
const children = computed(() => form.value.children.filter((item: any) => item.is_enable === '1'));
const custom_height = computed(() => {
    if (props.isCustom) {
        const layout: any = common_store.form_layout;
        const layout_style = layout.computer?.filed_title_size_type || 'small';
        const text_height = layout_style == 'big' ? 31 : layout_style == 'middle' ? 22.5 : 16.5;
        // 32 是按钮的大小 20是按钮与表格和标题与表格之间的间隔 text_height 是表头的高度
        return form.value.com_height - 32 - 20 - text_height + 'px;';
    } else {
        return '100%';
    }
});
watch(() => form.value.form_value, () => {
    if (form.value.is_required == '1' && form.value.form_value.length <= 0 && children.value.length > 0) {
        // 是否报错显示
        form.value.common_config.is_error = '1';
        form.value.common_config.error_text = '请填写至少一条记录';
    } else {
        // 否就清除报错显示
        form.value.common_config.is_error = '0';
        form.value.common_config.error_text = '';
    }
}, {immediate: true, deep: true});
// 用于样式显示
</script>
<style lang="scss" scoped>
.subform-data {
    width: 30rem;
    height: 7.6rem;
    background: #f0f1f4;
    font-size: 1.6rem;
    color: #838892;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

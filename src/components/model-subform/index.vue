<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content w">
                <template v-if="children.length > 0">
                    <subform-handle :key="get_math" :value="form" :is-preview="isPreview"></subform-handle>
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
const children = computed(() => form.value.children.filter((item: any) => props.isPreview ? item.is_enable === '1' : true));
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

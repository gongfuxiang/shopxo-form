<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content w">
                <template v-if="['option1', 'option2'].includes(form.date_type)">
                    <div class="re w h" :style="common_store.frame_style + style_container + 'height: 100%'">
                        <el-time-picker v-model="form.form_value" class="model-date" :style="common_store.frame_style + 'width:100%;'" is-range clearable placeholder="" :format="date_style_format" @focus="time_focus" @blur="time_blur" />
                        <icon v-if="is_time_icon_show" :name="form.icon_name" class="custom-icon" size="16" @click="custom_icon_click"></icon>
                    </div>
                </template>
                <template v-else>
                    <div class="re w h" :style="common_store.frame_style + style_container + 'height: 100%'">
                        <el-date-picker v-model="form.form_value" class="model-date" :style="common_store.frame_style + 'width:100%;'" :type="form.date_type == 'option3' ? 'monthrange' : form.date_type == 'option4' ? 'daterange' : 'datetimerange'" clearable placeholder="" :value-format="date_style_format" :format="date_style_format" @focus="time_focus" @blur="time_blur" />
                        <icon v-if="is_time_icon_show" :name="form.icon_name" class="custom-icon" size="16" @click="custom_icon_click"></icon>
                    </div>
                </template>
                <form-error v-if="form.common_config.is_error == '1'" v-model="form.common_config.error_text"></form-error>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { common_styles_computer, date_style_options, get_format_checks } from "@/utils";
import { commonStore } from "@/store";
import { isEmpty } from "lodash";
const common_store = commonStore();
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});
const form = computed(() => props.value);

const date_style_format = computed(() => {
    const data = new Map(date_style_options(form.value.date_style).map(item => [item.value, item]));
    return data.get(form.value.date_type)?.label || 'YYYY-MM-DD HH:mm:ss';
});
// 用于样式显示
const style_container = computed(() => common_styles_computer(form.value.common_config));
//#region 时间选择器内容出现
const is_time_icon_show = ref(true);
const time_focus = () => {
    if (!isEmpty(form.value.form_value)) {
        is_time_icon_show.value = false;
    } else {
        is_time_icon_show.value = true;
    }
};

const time_blur = () => {
    is_time_icon_show.value = true;
    get_format_checks(form.value)
};
const el_time = ref<any>(null);
const custom_icon_click = () => {
    if (el_time.value) {
        if (!isEmpty(form.value.form_value)) {
            is_time_icon_show.value = false;
        } else {
            is_time_icon_show.value = true;
        }
        el_time.value.focus();
    }
};
//#endregion
</script>
<style lang="scss" scoped>
.content {
    pointer-events: none;
}
:deep(.model-date) {
    width: 100% !important;
    .el-input__icon.el-range__icon {
        position: absolute;
        top: 0;
        right: 0;
        display: none;
    }
    .el-range-input {
        width: 44%;
    }
}
.custom-icon {
    position: absolute;
    top: 50%;
    max-height: 16px;
    z-index: 1;
    right: 1rem;
    background: #fff;
    transform: translateY(-50%);
}
</style>

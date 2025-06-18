<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content w">
                <div class="flex-col gap-10 align-c" :style="frame_style + 'height: 100%;'">
                    <el-cascader v-model="form.form_value" :options="common_store.address_list" class="border-focus" :style="frame_style + style_container" :props="{ 'value': 'id', 'label': 'name', 'children': 'items' }" filterable @change="data_check" />
                    <template v-if="form.address_type == 'detailed'">
                        <el-input v-model="form.detailed_value" type="textarea" class="border-focus" :style="frame_style + style_container + 'height:100%;'" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="请输入详细地址"></el-input>
                    </template>
                </div>
                <form-error v-if="form.common_config.is_error == '1'" v-model="form.common_config.error_text"></form-error>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { common_styles_computer, get_border_left_right_size, get_format_checks } from "@/utils";
import { commonStore } from "@/store";
const common_store = commonStore();
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    isCustom: {
        type: Boolean,
        default: false,
    }
});

const frame_style = computed(() => common_store.frame_style + `${ props.isCustom ? `max-width:100%;width:calc(100% - ${ get_border_left_right_size(form.value.common_config) }px);` : '' }`);

const form = computed(() => props.value);
const data_check = () => {
    get_format_checks(form.value, false, 'address');
};
// 用于样式显示
const style_container = computed(() => common_styles_computer(form.value.common_config));
</script>
<style lang="scss" scoped>
.pc-disable {
    cursor: all-scroll;
    background: rgba(5, 30, 80, 0.04);
    opacity: 0.4;
}
</style>

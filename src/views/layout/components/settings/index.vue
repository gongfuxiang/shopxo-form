<template>
    <div class="settings">
        <el-scrollbar>
            <div v-if="isShowFormModel" class="ptb-20 plr-12">
                <div class="flex-col gap-20">
                    <div class="flex-col gap-5">
                        <div class="new_title">模式</div>
                        <el-radio-group v-model="form.type_value" @change="type_change">
                            <el-radio value="default">标准模式</el-radio>
                            <el-radio value="free">自由模式</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="flex-col gap-10 w h">
                        <div class="new_title">布局设置</div>
                        <div class="flex-row jc-sb align-c gap-10 layout-style">
                            <div class="title">{{ form.is_layout_settings == '0' ? '未设置' : '已设置' }}</div>
                            <icon class="layout-style-setting" name="setup" size="18" @click="open_dialog('layout')"/>
                        </div>
                    </div>
                    <div class="flex-col gap-10 w h">
                        <div class="new_title">表单样式</div>
                        <div class="flex-row jc-sb align-c gap-10 layout-style">
                            <div class="title">{{ form.is_style_settings == '0' ? '未设置' : '已设置' }}</div>
                            <icon class="layout-style-setting" name="setup" size="18" @click="open_dialog('style')"/>
                        </div>
                    </div>
                    <div class="flex-row align-c jc-sb w h">
                        <div class="new_title">表单前台缓存</div>
                        <el-switch v-model="form.is_front_end_cache" active-value="1" inactive-value="0"></el-switch>
                    </div>
                    <div class="flex-col gap-10 w h">
                        <div class="new_title">操作按钮</div>
                        <div class="flex-row gap-5 jc-sb w h">
                            <el-input v-model="form.submit_title"></el-input>
                            <el-switch v-model="form.is_show_submit" active-value="1" inactive-value="0"></el-switch>
                        </div>
                        <div class="flex-row gap-5 jc-sb w h">
                            <el-input v-model="form.save_draft_title"></el-input>
                            <el-switch v-model="form.is_show_save_draft" active-value="1" inactive-value="0"></el-switch>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="ptb-20 plr-12">
                <div class="setting-content">
                    <!-- 单行文本 | 下拉框 | 单选按钮组-->
                    <template v-if="['single-text', 'select', 'radio-btns'].includes(model_value.key)">
                        <model-input-setting :value="model_value.com_data" :model-id="model_value.id"></model-input-setting>
                    </template>
                    <!-- 多行文本 -->
                    <template v-if="model_value.key == 'multi-text'">
                        <model-textarea-setting :value="model_value.com_data" :model-id="model_value.id"></model-textarea-setting>
                    </template>
                    <!-- 数字 -->
                    <template v-if="model_value.key == 'number'">
                        <model-number-setting :value="model_value.com_data" :model-id="model_value.id"></model-number-setting>
                    </template>
                    <template v-else>
                        <div class="pa-16 cr-6 mt-40 pt-40 tc">暂无设置</div>
                    </template>
                </div>
            </div>
        </el-scrollbar>
        <layout-index v-model:visible="dialog_visible" :config-type="dialog_type" :value="dialog_type == 'layout' ? form.layout_settings : form.style_settings" @handle-close="handleClose"></layout-index>
    </div>
</template>

<script setup lang="ts">
import { layout_settings, style_settings } from '@/utils/common';
import { isEqual } from "lodash";
const props = defineProps({
    value: {
        type: Object,
        default: () => {},
    },
    isShowFormModel: {
        type: Boolean,
        default: false,
    }
});
const form = ref(props.value);
const model_value = defineModel({ type: Object, default: () => ({}) });

const emits = defineEmits(['type']);
// 切换模式
const type_change = (val: any) => {
    emits('type', val);
};
// 打开弹出框
const dialog_visible = ref(false);
const dialog_type = ref('layout');
const open_dialog = (value: string) => {
    dialog_visible.value = true;
    dialog_type.value = value;
};
// 关闭之后判断是否有更改
const handleClose = () => {
    if (dialog_type.value == 'layout') {
        if (isEqual(form.value.layout_settings, layout_settings) ) {
            form.value.is_layout_settings = '0';
        } else {
            form.value.is_layout_settings = '1';
        }
    } else {
        if (isEqual(form.value.style_settings, style_settings) ) {
            form.value.is_style_settings = '0';
        } else {
            form.value.is_style_settings = '1';
        }
    }
};
</script>

<style scoped lang="scss">
.settings {
    width: 30rem;
    background-color: #fff;
    max-height: calc(100vh - 7rem);
    .radio-group {
        background: #f4f4f4;
        border-radius: 100rem;
        .el-radio-button {
            overflow: hidden;
            border-radius: 100rem;
            :deep(.el-radio-button__inner) {
                border: 0;
                background: #f4f4f4;
            }
            :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
                background: $cr-primary;
            }
        }
    }
    :deep(.el-input-number) {
        width: 100%;
    }
}
:deep(.el-dialog) {
    margin-top: 0;
    padding: 0;
    overflow: hidden;
    top: 7rem;
    width: 100%;
    height: calc(100% - 7rem);
    .el-dialog__header {
        padding: 2.3rem 2rem;
        text-align: center;
        .el-dialog__title {
            font-size: 16px;
        }
        .el-dialog__headerbtn {
            font-size: 2.4rem;
            padding: 2rem;
            height: auto;
            width: auto;
        }
    }
    .el-dialog__body {
        background: #f5f5f5;
        height: 100%;
    }
}
</style>

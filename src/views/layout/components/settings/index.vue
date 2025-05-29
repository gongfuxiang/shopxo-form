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
                    <template v-else-if="model_value.key == 'multi-text'">
                        <model-textarea-setting :value="model_value.com_data" :model-id="model_value.id"></model-textarea-setting>
                    </template>
                    <!-- 数字 -->
                    <template v-else-if="model_value.key == 'number'">
                        <model-number-setting :value="model_value.com_data" :model-id="model_value.id"></model-number-setting>
                    </template>
                    <!-- 日期时间 -->
                    <template v-else-if="model_value.key == 'date'">
                        <model-date-setting :value="model_value.com_data" :model-id="model_value.id"></model-date-setting>
                    </template>
                    <!-- 日期时间组 -->
                    <template v-else-if="model_value.key == 'date-group'">
                        <model-date-group-setting :value="model_value.com_data" :model-id="model_value.id"></model-date-group-setting>
                    </template>
                    <!-- 多选按钮组 ｜ 下拉复选框 -->
                    <template v-else-if="['checkbox', 'select-multi'].includes(model_value.key)">
                        <model-checkbox-setting :value="model_value.com_data" :model-id="model_value.id"></model-checkbox-setting>
                    </template>
                    <!-- 定位 -->
                    <template v-else-if="model_value.key == 'position'">
                        <model-position-setting :value="model_value.com_data" :model-id="model_value.id"></model-position-setting>
                    </template>
                    <!-- 富文本 -->
                    <template v-else-if="model_value.key == 'rich-text'">
                        <model-rich-text-setting :value="model_value.com_data" :model-id="model_value.id"></model-rich-text-setting>
                    </template>
                    <!-- 地址 -->
                    <template v-else-if="model_value.key == 'address'">
                        <model-address-setting :value="model_value.com_data" :model-id="model_value.id"></model-address-setting>
                    </template>
                    <!-- 手机 -->
                    <template v-else-if="model_value.key == 'phone'">
                        <model-phone-setting :value="model_value.com_data" :model-id="model_value.id"></model-phone-setting>
                    </template>
                    <!-- 密码 -->
                    <template v-else-if="model_value.key == 'pwd'">
                        <model-pwd-setting :value="model_value.com_data" :model-id="model_value.id"></model-pwd-setting>
                    </template>
                    <!-- 评分 -->
                    <template v-else-if="model_value.key == 'score'">
                        <model-score-setting :value="model_value.com_data" :model-id="model_value.id"></model-score-setting>
                    </template>
                    <!-- 上传图片｜上传视频 ｜ 上传文件 -->
                    <template v-else-if="['upload-img', 'upload-video', 'upload-attachments'].includes(model_value.key)">
                        <model-upload-setting :value="model_value.com_data" :model-id="model_value.id" :accept-type="model_value.key == 'upload-img' ? 'img' : model_value.key == 'upload-video' ? 'video' : 'file'"></model-upload-setting>
                    </template>
                    <!-- 辅助线 -->
                    <template v-else-if="model_value.key == 'auxiliary-line'">
                        <model-auxiliary-line-setting :value="model_value.com_data" :model-id="model_value.id"></model-auxiliary-line-setting>
                    </template>
                    <!-- 文本 -->
                    <template v-else-if="model_value.key == 'text'">
                        <model-text-setting :value="model_value.com_data" :model-id="model_value.id"></model-text-setting>
                    </template>
                    <!-- 图片 -->
                    <template v-else-if="model_value.key == 'img'">
                        <model-img-setting :value="model_value.com_data" :model-id="model_value.id"></model-img-setting>
                    </template>
                    <!-- 视频 -->
                    <template v-else-if="model_value.key == 'video'">
                        <model-video-setting :value="model_value.com_data" :model-id="model_value.id"></model-video-setting>
                    </template>
                    <!-- 视频 -->
                    <template v-else-if="model_value.key == 'attachments'">
                        <model-attachments-setting :value="model_value.com_data" :model-id="model_value.id"></model-attachments-setting>
                    </template>
                    <template v-else>
                        <div class="pa-16 cr-6 mt-40 pt-40 tc">暂无设置</div>
                    </template>
                </div>
            </div>
        </el-scrollbar>
        <layout-index v-model:visible="dialog_visible" :config-type="dialog_type" :value="dialog_type == 'layout' ? form.layout_settings : form.style_settings" :diy-data="props.diyData" @handle-close="handleClose"></layout-index>
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
    },
    diyData: {
        type: Array as PropType<any[]>,
        default: () => [],
    },
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
</style>

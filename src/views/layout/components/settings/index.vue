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
                    <template v-if="form.type_value === 'free'">
                        <div class="flex-col gap-10 w h">
                            <div class="new_title">表单尺寸</div>
                            <div class="flex-col jc-c gap-10">
                                <el-radio-group v-model="custom_config.type" class="radio_form_size w h" is-button @change="custom_type_change">
                                    <el-radio-button v-for="(item, index) in option_list" :key="index" :value="item.name">{{ item.name }}</el-radio-button>
                                </el-radio-group>
                                <div class="flex-row gap-10 align-c">
                                    <input-number v-model:model-value="custom_config.width" :min="1" :max="1000"></input-number>~<input-number v-model:model-value="custom_config.height" :min="1" :max="3000"></input-number>
                                    <el-button type="primary" @click="submit">确定</el-button>
                                </div>
                            </div>
                        </div>
                    </template>
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
                        <model-img-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-img-setting>
                    </template>
                    <!-- 视频 -->
                    <template v-else-if="model_value.key == 'video'">
                        <model-video-setting :value="model_value.com_data" :model-id="model_value.id" :is-custom="isCustom"></model-video-setting>
                    </template>
                    <!-- 视频 -->
                    <template v-else-if="model_value.key == 'attachments'">
                        <model-attachments-setting :value="model_value.com_data" :model-id="model_value.id"></model-attachments-setting>
                    </template>
                    <!-- 矩形 | 圆形 -->
                    <template v-else-if="['rect', 'round'].includes(model_value.key)">
                        <model-rect-or-round-setting :value="model_value.com_data" :model-id="model_value.id"></model-rect-or-round-setting>
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
import { isEqual, cloneDeep } from "lodash";
const props = defineProps({
    value: {
        type: Object,
        default: () => {},
    },
    isShowFormModel: {
        type: Boolean,
        default: false,
    },
    isCustom: {
        type: Boolean,
        default: false
    }
});
const form = ref(props.value);
const model_value = defineModel({ type: Object, default: () => ({}) });

const emits = defineEmits(['type_change']);
// 切换模式
const type_change = () => {
    emits('type_change');
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
const option_list = [
    { name: 'A3', width: 297, height: 420 },
    { name: 'A4', width: 210, height: 297 },
    { name: 'A5', width: 148, height: 210 },
    { name: 'B3', width: 353, height: 500 },
    { name: 'B4', width: 250, height: 353 },
    { name: 'B5', width: 176, height: 250 },
];
// 初始化自定义配置对象，用于存储纸张类型、宽度和高度
const custom_config = reactive({ type: 'A3', width: 297, height: 420 });

// 监听props.value的变化，当发生变化时，更新自定义配置对象的属性
watch(() => props.value, (val) => {
    custom_config.type = cloneDeep(val.custom_size_type);
    custom_config.width = cloneDeep(val.custom_width);
    custom_config.height = cloneDeep(val.custom_height);
});

/**
 * 提交函数，将当前自定义配置应用到表单对象
 * 此函数确保在提交时，表单数据与用户最后的配置保持一致
 */
const submit = () => {
    form.value.custom_size_type = cloneDeep(custom_config.type);
    form.value.custom_width = cloneDeep(custom_config.width);
    form.value.custom_height = cloneDeep(custom_config.height);
};

/**
 * 自定义类型变化处理函数
 * 当选择不同的纸张类型时，根据选项列表更新自定义配置的宽度和高度
 * @param {string | number | boolean | undefined} val - 选择的纸张类型值
 */
const custom_type_change = (val: string | number | boolean | undefined) => {
    const data = option_list.filter((item: any) => item.name === val);
    if (data.length > 0) {
        custom_config.width = cloneDeep(data[0].width);
        custom_config.height = cloneDeep(data[0].height);
    }
}
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
.radio_form_size {
    :deep(.el-radio-button__inner) {
        padding: 0.9rem 1.2rem;
    }
    :deep(.el-radio-button.is-active) {
        .el-radio-button__inner {
            background: #fff;
            border-color: $cr-main;
            color: $cr-main;
        }
    }
}
</style>

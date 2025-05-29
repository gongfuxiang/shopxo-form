<template>
    <layout-dialog v-model:visible="dialogVisible" :title="configType == 'layout' ? '表单布局' : '表单样式'" @handle-close="handleClose">
        <div class="flex-row h w">
            <div class="flex-1 re">
                <div class="abs w h">
                    <!-- 背景信息 -->
                    <template v-if="config_value.background_type == 'img' && config_value.background_image.length > 0">
                        <image-empty v-model="config_value.background_image[0]" error-style="width:100%;height:100%;"></image-empty>
                    </template>
                    <template v-else>
                        <div :style="`height:100%;width:100%;background:${ config_value.background_color }`"></div>
                    </template>
                </div>
                <!-- 内容信息 -->
                <div v-if="type_value == 'computer'" class="dialog-main re z-i">
                    <!-- 头部数据 -->
                    <div class="main-overflow" :style="{ height: (form_config.is_show_submit == '1' || form_config.is_show_save_draft == '1') ? 'calc(100% - 7.6rem)' : '100%'}">
                        <div class="main-content">
                            <div v-if="configType !== 'layout'" class="dialog-main-header">
                                <template v-if="config_value.heading_type == 'img' && config_value.heading_image > 0">
                                    <image-empty v-model="config_value.heading_image[0]" error-style="width:100%;height:3.2rem;"></image-empty>
                                </template>
                                <template v-else>
                                    <div :style="`height:3.2rem;width:100%;background:${ config_value.heading_color }`"></div>
                                </template>
                                <div v-if="config_value.is_show_heading_title == '1'" class="head-title flex-row" :style="`color:${ config_value.heading_title_color };font-size:${ config_value.heading_title_size }px;font-weight:${ config_value.heading_title_font_weight };`">{{ common_store.form_model_config.name }}</div>
                            </div>
                            <div class="pa-16">
                                <div v-for="(item) in diy_data" :key="item.id" :class="['component-style', { 'required-error': item.com_data.common_config.is_error == '1' }]">
                                    <component-show :value="item"></component-show>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 底部数据 -->
                    <div v-if="form_config.is_show_submit == '1' || form_config.is_show_save_draft == '1'" class="main-footer-overflow">
                        <div class="main-footer flex-row align-c jc-e gap-20 right-0">
                            <el-button v-if="form_config.is_show_save_draft == '1'" plain>{{ form_config.submit_title }}</el-button>
                            <el-button v-if="form_config.is_show_submit == '1'" dark :color="form_config.style_settings.computer.submit_color"><span style="color:#fff;">{{ form_config.save_draft_title }}</span></el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-col bg-f" style="width: 234px;">
                <div class="flex-row jc-c pa-16 br-b-f8">
                    <el-radio-group v-model="type_value" class="radio-group" size="large" is-button>
                        <el-radio-button class="radio-item" value="computer">电脑端</el-radio-button>
                        <el-radio-button class="radio-item" value="mobile">移动端</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="ptb-20 plr-12">
                    <layout-right :config-type="configType" :port-type="type_value" :value="type_value == 'computer' ? form.computer : form.mobile" />
                </div>
            </div>
        </div>
    </layout-dialog>
</template>

<script lang="ts" setup>
import { commonStore } from "@/store";
const common_store = commonStore();
const props = defineProps({
    configType: {
        type: String,
        default: 'layout', // 配置类型，layout：表单布局，style：表单样式
    },
    value: {
        type: Object,
        default: () => { },
    },
    diyData: {
        type: Array as PropType<any[]>,
        default: () => [],
    }
});
// 公共配置信息
const form_config = computed(() => common_store.form_config);
// 配置信息，区分是手机端数据还是电脑端数据
const config_value = computed(() => type_value.value == 'computer' ? form.value.computer : form.value.mobile);
const diy_data = ref(props.diyData);
const form = ref(props.value);
watch(() => props.value, () => {
    form.value = props.value;
});
const type_value = ref('computer');
// 弹出框显示逻辑
const dialogVisible = defineModel('visible', { type: Boolean, default: false })
const emit = defineEmits(['handleClose']);
const handleClose = () => {
    type_value.value = 'computer';
    dialogVisible.value = false;
    emit('handleClose');
};
</script>

<style lang="scss" scoped>
.radio-group {
    background: #f4f4f4;
    border-radius: 100rem;

    .el-radio-button {
        overflow: hidden;
        border-radius: 100rem;

        :deep(.el-radio-button__inner) {
            width: 10rem;
            border: 0;
            background: #f4f4f4;
        }

        :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
            background: $cr-primary;
        }
    }
}

.title-location-icon {
    padding: 1rem;
    background: #FFFFFF;
    border-radius: 0.4rem;
    border: 0.1rem solid #EEEEEE;
    .location-icon {
        width: 100%;
        height: 1.5rem;
        background: #F4F4F4;
        border-radius: 2px;
    }
    .location-icon-1 {
        width: 2.6rem;
        background: #E4EEF4;
    }
    .location-height {
        height: 3.5rem;
    }
}

.title-location-icon.active {
    border: 0.1rem solid #2A94FF;
}
.dialog-main .component-style{
    :deep(.rendering-area .content) {
        pointer-events: none;
    }
}
.head-title { 
    word-wrap: break-word;
    font-size: 20px;
    padding: 18px 30px 0;
    word-break: break-word;
}
</style>
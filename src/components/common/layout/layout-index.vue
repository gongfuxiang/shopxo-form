<template>
    <layout-dialog v-model:visible="dialogVisible" :title="configType == 'layout' ? '表单布局' : '表单样式'" @handle-close="handleClose">
        <div class="flex-row h w">
            <div class="flex-1 re w h">
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
                <div v-if="type_value == 'computer'" class="dialog-main re z-i w h">
                    <!-- 表单数据 -->
                    <div class="main-overflow h flex-col align-c jc-c">
                        <template v-if="common_store.form_config.type_value == 'free'">
                            <div :style="`width: ${ common_store.form_config.custom_width }px;`">
                                <div v-if="configType !== 'layout'" class="dialog-main-header">
                                    <template v-if="config_value.heading_type == 'img' && config_value.heading_image.length > 0">
                                        <image-empty v-model="config_value.heading_image[0]" error-style="width:100%;height:3.2rem;"></image-empty>
                                    </template>
                                    <template v-else>
                                        <div :style="`height:3.2rem;width:100%;background:${ config_value.heading_color }`"></div>
                                    </template>
                                    <div v-if="config_value.is_show_heading_title == '1'" class="head-title flex-row" :style="`color:${ config_value.heading_title_color };font-size:${ config_value.heading_title_size }px;font-weight:${ config_value.heading_title_font_weight };`">{{ common_store.form_model_config.name }}</div>
                                </div>
                                <div class="re bg-f main-content" :style="`width: ${ common_store.form_config.custom_width }px;height: ${ common_store.form_config.custom_height }px;margin: 0 auto;`">
                                    <div v-for="(item, index) in filteredDiyData" :key="item.id" :data-id="item.id" :data-location-x="item.location.x" :data-location-y="item.location.y" :class="['free-main-content flex-row oh', { 'required-error': item.com_data.common_config.is_error == '1' }]" :style="`left: ${ percentage_count(item.location.x, item.com_data.data_follow, 'left') }; top: ${ percentage_count(item.location.y, item.com_data.data_follow, 'top') }; width: ${ percentage_count(item.com_data.com_width, item.com_data.data_follow, 'width', item.com_data.is_width_auto, item.com_data.max_width, item.is_enable) }; height: ${ percentage_count(item.com_data.com_height, item.com_data.data_follow, 'height', item.com_data.is_height_auto, item.com_data.max_height, item.is_enable) };z-index: ${ item.is_enable == '1' ? ((filteredDiyData.length - 1) - index) : -999};`">
                                        <component-show :value="item" :is-custom="true"></component-show>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="main-content" :style="{ 'min-height': (form_config.is_show_submit == '1' || form_config.is_show_save_draft == '1') ? 'calc(100% - 8rem)' : '100%' }">
                                <div v-if="configType !== 'layout'" class="dialog-main-header">
                                    <template v-if="config_value.heading_type == 'img' && config_value.heading_image.length > 0">
                                        <image-empty v-model="config_value.heading_image[0]" error-style="width:100%;height:3.2rem;"></image-empty>
                                    </template>
                                    <template v-else>
                                        <div :style="`height:3.2rem;width:100%;background:${ config_value.heading_color }`"></div>
                                    </template>
                                    <div v-if="config_value.is_show_heading_title == '1'" class="head-title flex-row" :style="`color:${ config_value.heading_title_color };font-size:${ config_value.heading_title_size }px;font-weight:${ config_value.heading_title_font_weight };`">{{ common_store.form_model_config.name }}</div>
                                </div>
                                <div class="pa-16">
                                    <div v-for="item in filteredDiyData" :key="item.id" :class="['component-style', { 'required-error': item.com_data.common_config.is_error == '1' }]">
                                        <component-show :value="item"></component-show>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <!-- 底部数据 -->
                        <div v-if="form_config.is_show_submit == '1' || form_config.is_show_save_draft == '1'" class="main-footer-overflow">
                            <div class="main-footer flex-row align-c jc-e gap-20 right-0" :style="`width: ${ common_store.form_config.type_value == 'free' ? common_store.form_config.custom_width : 1000}px;`">
                                <el-button v-if="form_config.is_show_save_draft == '1'" plain>{{ form_config.submit_title }}</el-button>
                                <el-button v-if="form_config.is_show_submit == '1'" dark :color="form_config.style_settings.computer.submit_color"><span style="color:#fff;">{{ form_config.save_draft_title }}</span></el-button>
                            </div>
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
interface DiyItem {
    id: number | string;
    key: string;
    is_enable: string;
    com_data: any;
}

const props = defineProps({
    configType: {
        type: String,
        default: 'layout', // 配置类型，layout：表单布局，style：表单样式
    },
    value: {
        type: Object,
        default: () => { },
    },
    scale: {
        type: Number,
        default: 1
    }
});
// 从组件的顶层获取数据，避免多层组件传值导致数据遗漏和多余代码
const diy_data: any = toRef(inject('diy_data', []));
// 计算属性：根据显隐规则过滤出需要显示的组件
const filteredDiyData = computed(() => {
    const componentMap = new Map(diy_data.value.map((item: any) => [item.id, item])) as any;

    // 取出所有设置显隐规则的组件
    const list = diy_data.value.filter((item: any) => ['single-text', 'select', 'radio-btns'].includes(item.key) && ['select', 'radio-btns'].includes(item.com_data.type) && item.com_data.show_hidden_list.length > 0);
    const list_map = list.map((item: DiyItem) => ({ id: item.id, list: item.com_data.show_hidden_list }));
    return diy_data.value.filter((item: DiyItem) => {
        // 优先判断是否启用
        if (item.is_enable !== '1') return false;

        if (list_map.length === 0) return true;
        // 将所有的内容的组件进行筛选
        const isShownByRule = list_map.some((list_item: any) => {
            const targetComponent = componentMap.get(list_item.id);
            // 判断显隐规则对应的组件是否存在
            if (!targetComponent) return false;
            return list_item.list.some((hidden_item: any) => {
                // 判断当前组件是否在显隐规则中，如果不在，直接显示，否则的话判断值是否存在
                if (hidden_item.is_show.includes(item.id)) {
                    return targetComponent.com_data.form_value.includes(hidden_item.value);
                } else {
                    return true;
                }
            });
        });
        return isShownByRule;
    });
});
// 公共配置信息
const form_config = computed(() => common_store.form_config);
// 配置信息，区分是手机端数据还是电脑端数据
const config_value = computed(() => type_value.value == 'computer' ? form.value.computer : form.value.mobile);
const form = ref(props.value);
watch(() => props.value, () => {
    form.value = props.value;
});
const type_value = ref('computer');
// 弹出框显示逻辑
const dialogVisible = defineModel('visible', { type: Boolean, default: false })
/**
 * 根据给定的值、跟随数据、类型等参数计算并返回一个表示百分比或特定值的字符串
 * 主要用于计算CSS样式中的尺寸属性值
 * 
 * @param {number} val - 需要转换为百分比或特定值的原始数值
 * @param {Object} data_follow - 包含跟随信息的对象，用于确定是否需要跟随其他元素
 * @param {string} type - 尺寸类型，可以是'left'、'top'、'width'或'height'
 * @param {string} [is_auto] - 可选参数，如果设置为'1'，则根据type和max_size计算自动样式
 * @param {number} [max_size] - 可选参数，用于计算最大宽度或高度
 * @returns {string} - 返回一个表示百分比或特定值的字符串，用于CSS样式
 */
 const percentage_count = (val: number, data_follow: { id: string, type: string }, type: string, is_auto?: string, max_size?: number, is_enable?: string) => {
    // 检查类型是否为'left'或'top'，如果是，则根据跟随数据计算样式
    if (['left', 'top'].includes(type)) {
        const { id = '', type: follow_type = 'left' } = data_follow || { id: '', type: 'left' };
        // 如果id不为空且follow_type与type匹配，则返回原始值的字符串表示
        if (id !== '' && follow_type === type) {
            return `${val}px`;
        }
        // 如果条件不满足，则根据比例缩放val并返回
        return `${val * props.scale}px`;
    } else {
        // 如果is_auto设置为'1'，则根据type和max_size计算自动样式
        if (is_auto === '1') {
            if (type === 'width' || type === 'height') {
                if (typeof max_size === 'number' && max_size >= 0) {
                    const scaledMaxSize = max_size * props.scale;
                    const autoStyle = 'auto;';
                    const maxSizeStyle = scaledMaxSize > 0 ? ` max-${type}: ${scaledMaxSize}px;` : '';
                    const whiteSpaceStyle = type === 'width' && scaledMaxSize <= 0 ? ' white-space:nowrap;' : '';
                    return `${ autoStyle }${ maxSizeStyle }${ whiteSpaceStyle }`;
                } else {
                    return 'auto;';
                }
            }
        } else {
            // 如果is_auto未设置或条件不满足，则根据比例缩放val并返回
            return is_enable == '1' ? `${val * props.scale}px` : '0px';
        }
    }
}

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
.head-title { 
    word-wrap: break-word;
    font-size: 20px;
    padding: 18px 30px 0;
    word-break: break-word;
}
.dialog-main-header {
    background: #fff;
}
</style>
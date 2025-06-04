<template>
    <el-dialog v-model="dialogVisible" class="layout-dialog form-dialog" :close-on-press-escape="false" close-on-click-modal :append-to-body="false" :before-close="handleClose">
        <template #header>
            <el-radio-group v-model="type_value" class="custom-radio-group">
                <el-radio-button value="computer">
                    <icon name="computer" size="14"></icon>
                </el-radio-button>
                <el-radio-button value="mobile">
                    <icon name="phone" size="14"></icon>
                </el-radio-button>
            </el-radio-group>
        </template>
        <div class="flex-row h w bg-f8">
            <div v-if="type_value == 'computer'" class="flex-1 dialog-main">
                <!-- 表单数据 -->
                <div class="main-overflow h flex-col align-c jc-c">
                    <template v-if="common_store.form_config.type_value == 'free'">
                        <div class="re bg-f oh" :style="`width: ${ common_store.form_config.custom_width }px;height: ${ common_store.form_config.custom_height }px;margin: 0 auto;`">
                            <div v-for="(item, index) in filteredDiyData" :key="item.id" :data-id="item.id" :data-location-x="item.location.x" :data-location-y="item.location.y" :class="['free-main-content flex-row oh', { 'required-error': item.com_data.common_config.is_error == '1' }]" :style="`left: ${ percentage_count(item.location.x, item.com_data.data_follow, 'left') }; top: ${ percentage_count(item.location.y, item.com_data.data_follow, 'top') }; width: ${ percentage_count(item.com_data.com_width, item.com_data.data_follow, 'width', item.com_data.is_width_auto, item.com_data.max_width, item.is_enable) }; height: ${ percentage_count(item.com_data.com_height, item.com_data.data_follow, 'height', item.com_data.is_height_auto, item.com_data.max_height, item.is_enable) };z-index: ${ item.is_enable == '1' ? ((filteredDiyData.length - 1) - index) : -999};`">
                                <component-show :value="item" :is-custom="true"></component-show>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="main-content" :style="{ 'min-height': (form_config.is_show_submit == '1' || form_config.is_show_save_draft == '1') ? 'calc(100% - 8rem)' : '100%' }">
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
                            <el-button v-if="form_config.is_show_save_draft == '1'" plain @click="save_draft">{{form_config.submit_title }}</el-button>
                            <el-button v-if="form_config.is_show_submit == '1'" dark :color="form_config.style_settings.computer.submit_color" @click="submit"><span style="color:#fff;">{{ form_config.save_draft_title }}</span></el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
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
    value: {
        type: Object,
        default: () => { },
    },
    scale: {
        type: Number,
        default: 1
    }
});
const diy_data = ref(props.value);
watch(() => props.value, () => {
    diy_data.value = props.value;
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
const form_config = computed(() => common_store.form_config);
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
//#region 表单操作逻辑
// 保存草稿
const save_draft = () => {

};
const submit = () => {

}
//#endregion
</script>

<style lang="scss" scoped>
.custom-radio-group {
    width: 17rem;
    height: 4.4rem;
    background: #F3F3F3;
    border-radius: 4px;
    padding: 0.2rem;

    .el-radio-button {
        width: 50%;
    }

    .el-radio-button.is-active {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff !important;
        ;

        :deep(.el-radio-button__inner) {
            color: #2A94FF !important;
            ;
        }
    }

    :deep(.el-radio-button__inner) {
        border: 0;
        color: #000 !important;
        box-shadow: none !important;
        background-color: transparent !important;
    }
}
.free-main-content {
    position: absolute;
    overflow: hidden;
}
</style>
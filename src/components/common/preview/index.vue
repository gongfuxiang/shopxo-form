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
                <div class="main-overflow" :style="{ height: (form_config.is_show_submit == '1' || form_config.is_show_save_draft == '1') ? 'calc(100% - 7.6rem)' : '100%' }">
                    <div class="main-content pa-16">
                        <div v-for="item in filteredDiyData" :key="item.id" :class="['component-style', { 'required-error': item.com_data.common_config.is_error == '1' }]">
                            <component-show :value="item"></component-show>
                        </div>
                    </div>
                </div>
                <!-- 底部数据 -->
                <div v-if="form_config.is_show_submit == '1' || form_config.is_show_save_draft == '1'" class="main-footer-overflow">
                    <div class="main-footer flex-row align-c jc-e gap-20 right-0">
                        <el-button v-if="form_config.is_show_save_draft == '1'" plain @click="save_draft">{{form_config.submit_title }}</el-button>
                        <el-button v-if="form_config.is_show_submit == '1'" dark :color="form_config.style_settings.computer.submit_color" @click="submit"><span style="color:#fff;">{{ form_config.save_draft_title }}</span></el-button>
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
</style>
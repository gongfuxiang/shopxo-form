<template>
    <div class="layout">
        <navbar v-model="form.model" @form-config="form_config_event" />
        <div class="content flex-1 flex-row">
            <div v-if="form_type == 'default'" class="flex-1">
                <mains :diy-data="form.diy_data" @update-setting="update_setting"></mains>
            </div>
            <view v-else class="flex-1">
                <main-free :diy-data="form.diy_data" @update-setting="update_setting"></main-free>
            </view>
            <settings :key="key" v-model="diy_data_item" :is-show-form-model="is_show_form_model" :type="form_type" @type="form_type = $event"></settings>
        </div>
    </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash';
import defaultSettings from './index';
interface diy_data_item {
    id: string;
    model: {
        logo: string;
        name: string;
        is_enable: string;
        describe: string;
    };
    diy_data: Array<any>;
}
const form = ref<diy_data_item>({
    id: '',
    model: {
        logo: '',
        name: '112233',
        is_enable: '1',
        describe: '',
    },
    diy_data: [],
});
const diy_data_item = ref({});
const key = ref('');

// 更新设置
const update_setting = (data: any) => {
    diy_data_item.value = data;
    // 生成随机id
    key.value = Math.random().toString(36).substring(2);
};
// 页面加载
onMounted(() => {
    init();
});

const init = () => {
    form.value.diy_data = data_merge(form.value.diy_data);
};

// 数据合并
const data_merge = (list: string[]) => {
    list.forEach((item: any) => {
        item.com_data = default_merge(item.com_data, item.key);
    });
    return list;
};
// 浅层数据合并
const default_merge = (data: any, key: string) => {
    if (data.style) {
        data.style = Object.assign({}, cloneDeep((defaultSettings as any)[key.replace(/-/g, '_')]).style, data.style);
    } else {
        data.style = cloneDeep((defaultSettings as any)[key.replace(/-/g, '_')]).style;
    }
    if (data.content) {
        data.content = Object.assign({}, cloneDeep((defaultSettings as any)[key.replace(/-/g, '_')]).content, data.content);
    } else {
        data.content = cloneDeep((defaultSettings as any)[key.replace(/-/g, '_')]).content;
    }
    return data;
};

// 表单配置
const is_show_form_model = ref(false);
const form_type = ref('default');
// 表单配置 事件
const form_config_event = () => {
    console.log('表单配置');
    is_show_form_model.value = !is_show_form_model.value;
};
</script>

<style scoped lang="scss">
.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f8f8f8;
    // 拖拽禁止选中
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
}
</style>

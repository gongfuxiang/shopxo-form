<template>
    <div class="layout">
        <navbar v-model="form.model" @form-config="form_config_event" />
        <div class="content flex-1 flex-row">
            <div v-if="form.overall_config.type_value == 'default'" class="flex-1">
                <mains :diy-data="form.diy_data" @update-setting="update_setting"></mains>
            </div>
            <view v-else class="flex-1">
                <main-free :diy-data="form.diy_data" @update-setting="update_setting"></main-free>
            </view>
            <settings :key="key" v-model="diy_data_item" :is-show-form-model="is_show_form_model" :value="form.overall_config" @type="form.overall_config.type_value = $event"></settings>
        </div>
    </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash';
import defaultSettings from './index';
import { background_computer } from '@/utils';
import { commonStore } from '@/store';
const common_store = commonStore();
interface diy_data_item {
    id: string;
    model: {
        logo: string;
        name: string;
        is_enable: string;
        describe: string;
    };
    overall_config: {
        type_value: string;
        is_layout_settings: string;
        layout_settings: object,
        is_style_settings: string;
        style_settings: object, 
        is_front_end_cache: string,
        is_show_submit: string,
        submit_title: string,
        is_show_save_draft: string,
        save_draft_title: string,
    };
    diy_data: Array<any>;
}
const form = ref<diy_data_item>({
    id: '',
    model: {
        logo: '',
        name: '未命名表单',
        is_enable: '1',
        describe: '',
    },
    overall_config: {
        type_value: 'default',
        is_layout_settings: '0',
        layout_settings: {
            computer: {
                flex_direction: 'column',
                filed_title_width: 100,
                filed_title_justification: 'left',
                filed_title_size_type: 'middle',
                input_width_type: 'default',
            },
            mobile: {
                flex_direction: 'column',
                filed_title_width: 100,
                filed_title_justification: 'left',
                filed_title_size_type: 'middle',
                input_width_type: 'default',
            }
        },
        is_style_settings: '0',
        style_settings: {
            computer: {
                background_type: 'color',
                background_color: '#F8F8F8',
                background_image: [],
                heading_type: 'color',
                heading_color: '#C1EBFF',
                heading_image: [],
                is_show_heading_title: '0',
                heading_title_location: "left",
                heading_title_size: 14,
                heading_title_font_weight: 'normal',
                heading_title_color: '#000000',
                submit_color: '#2A94FF',
            },
            mobile: {
                background_type: 'color',
                background_color: '#F8F8F8',
                background_image: [],
                heading_type: 'color',
                heading_color: '#C1EBFF',
                heading_image: [],
                is_show_heading_title: '0',
                heading_title_location: "left",
                heading_title_size: 14,
                heading_title_font_weight: 'normal',
                heading_title_color: '#000000',
                submit_color: '#2A94FF',
            }
        }, 
        is_front_end_cache: '1',
        is_show_submit: '1',
        submit_title: '提交',
        is_show_save_draft: '1',
        save_draft_title: '保存草稿',
    },
    diy_data: [],
});
common_store.set_form_layout(form.value.overall_config.layout_settings);
const diy_data_item = ref({});
const key = ref('');

// 更新设置
const update_setting = (data: any) => {
    diy_data_item.value = data;
    is_show_form_model.value = false;
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
// 表单配置 事件
const form_config_event = () => {
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

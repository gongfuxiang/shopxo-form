<template>
    <div class="layout">
        <navbar v-model="form.model" @form-config="form_config_event" @preview="preview_event" />
        <div class="content flex-1 flex-row">
            <div v-if="form.overall_config.type_value == 'default'" class="flex-1 main-style">
                <mains :diy-data="form.diy_data" @update-setting="update_setting"></mains>
            </div>
            <view v-else class="flex-1 main-style">
                <main-free :diy-data="form.diy_data" @update-setting="update_setting"></main-free>
            </view>
            <settings :key="key" v-model="diy_data_item" :is-show-form-model="is_show_form_model" :is-custom="selected_is_custom" :value="form.overall_config" :diy-data="form.diy_data" @type="form.overall_config.type_value = $event" @type_change="type_change"></settings>
            <preview :key="previewKey" v-model:visible="previewVisible" :value="form.diy_data"></preview>
        </div>
    </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash';
import { layout_settings, style_settings } from '@/utils/common';
import defaultSettings from './index';
import CommonAPI from '@/api/common';
import { commonStore } from '@/store';
import { get_math } from '@/utils';
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
        custom_size_type: string,
        custom_width: number,
        custom_height: number,
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
        custom_size_type: 'A3',
        custom_width:  297,
        custom_height:  420,
        layout_settings: cloneDeep(layout_settings),
        is_style_settings: '0',
        style_settings: cloneDeep(style_settings), 
        is_front_end_cache: '1',
        is_show_submit: '1',
        submit_title: '提交',
        is_show_save_draft: '1',
        save_draft_title: '保存草稿',
    },
    diy_data: [],
});
// 公共配置信息
common_store.set_form_layout(form.value.overall_config.layout_settings);
common_store.set_config(form.value.overall_config);
common_store.set_model_config(form.value.model);

const diy_data_item = ref({});
const key = ref('');
const selected_is_custom = ref(false);
// 更新设置
const update_setting = (data: any, diy: any[], is_custom: boolean = false) => {
    diy_data_item.value = data;
    form.value.diy_data = diy;
    selected_is_custom.value = is_custom;
    is_show_form_model.value = false;
    // 生成随机id
    key.value = Math.random().toString(36).substring(2);
};
// 页面加载
onMounted(() => {
    common_init();
});

const common_init = () => {
    common_store.get_address();
    CommonAPI.getInit().then((res: any) => {
        common_store.set_common(res.data);
        init();
    });
};
const init = () => {
    form.value.diy_data = data_merge(form.value.diy_data);
};
// 将内容传递给子组件, 避免多次传递
provide('diy_data', computed(() => form.value.diy_data));
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
// 预览信息
const previewVisible = ref(false);
const previewKey = ref('');
const preview_event = () => {
    previewKey.value = get_math();
    previewVisible.value = true;
}
// 模式切换的时候清空缓存数据
const type_change = () => {
    form.value.diy_data = [];
}
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
:deep(.el-dialog.layout-dialog) {
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
:deep(.el-dialog.layout-dialog.form-dialog) {
    top: 0;
    height: 100%;
    .el-dialog__header {
        padding: 1.3rem 2rem;
    }
}
.main-style {
    max-width: calc(100% - 30rem);
}
</style>

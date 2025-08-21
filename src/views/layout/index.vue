<template>
    <div v-loading.fullscreen.lock="loading" element-loading-background="rgba(255,255,255,1)" element-loading-custom-class="loading-custom" class="layout">
        <template v-if="!loading_content">
            <template v-if="!is_empty">
                <navbar v-model="form.model" :save-disabled="save_disabled" @form-config="form_config_event" @preview="preview_event" @save="save_event" @save-close="save_close_event" @export="export_data_event" @import="import_data_event" @clear="clear_event" />
                <div class="content flex-1 flex-row">
                    <div v-if="form.overall_config.type_value == 'default'" class="flex-1 main-style">
                        <mains :diy-data="form.diy_data" @update-setting="update_setting"></mains>
                    </div>
                    <view v-else class="flex-1 main-style">
                        <main-free :diy-data="form.diy_data" @update-setting="update_setting"></main-free>
                    </view>
                    <settings :key="key" v-model="diy_data_item" :is-show-form-model="is_show_form_model" :is-custom="selected_is_custom" :value="form.overall_config" :diy-data="form.diy_data" @type="form.overall_config.type_value = $event" @type_change="type_change"></settings>
                </div>
            </template>
            <template v-else>
                <no-data height="100vh" img-width="260px" size="16px" text="编辑数据有误"></no-data>
            </template>
        </template>
        <preview :key="previewKey" v-model:visible="previewVisible" :value="form.diy_data"></preview>
        <template-import v-model="import_temp_visible_dialog" @confirm="handleImportConfirm"></template-import>
    </div>
</template>

<script setup lang="ts">
import { cloneDeep, isEmpty } from 'lodash';
import { style_settings } from '@/utils/common';
import CommonAPI from '@/api/common';
import ForminputAPI, { formConfig, formData, form_data_item } from '@/api/form'; 
import { commonStore } from '@/store';
import { common_styles_computer, date_style_options, get_cookie, get_id, is_obj, set_cookie, time_stamp } from '@/utils';
import defaultSettings from './index';
const common_store = commonStore();
const app = getCurrentInstance();
const form = ref<form_data_item>({
    id: '',
    model: {
        logo: '',
        name: '未命名表单',
        is_enable: '1',
        describe: '',
    },
    overall_config: {
        type_value: 'default',
        // is_layout_settings: '0',
        custom_size_type: 'A3',
        custom_width: 842,
        custom_height: 1191,
        // layout_settings: cloneDeep(layout_settings),
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

const diy_data_item = ref({});
const key = ref('');
const selected_is_custom = ref(false);
// 更新设置
const update_setting = (data: any, diy: any[], is_custom: boolean = false) => {
    diy_data_item.value = data;
    form.value.diy_data = diy;
    selected_is_custom.value = is_custom;
    if (!isEmpty(data)) {
        is_show_form_model.value = false;
    }
    // 生成随机id
    key.value = Math.random().toString(36).substring(2);
};
// 全局loading
const fullscreen_loading = ref(false);
// 页面加载
onMounted(() => {
    fullscreen_loading.value = true;
    common_init();
});
const common_init = () => {
    if (get_cookie('attachment_host') || get_cookie('attachment_host') !== 'null' || get_cookie('attachment_host') !== null) {
        CommonAPI.getInit().then((res: any) => {
            common_store.set_common(res.data);
            set_cookie('attachment_host', res.data.config.attachment_host);
            init();
        });
    } else {
        // 将localStorage中的数据读取出
        // 判断localStorage中是否有数据
        if (localStorage.getItem('forminput_init_common')) {
            const data = JSON.parse(localStorage.getItem('forminput_init_common') || '');
            common_store.set_common(data);
            // 清除缓存
            localStorage.removeItem('forminput_init_common');
            init();
        }
    }
    common_store.get_address();
};

const is_empty = ref(false);
const init = () => {
    if (get_id()) {
        ForminputAPI.getInit({ id: get_id() }).then((res: any) => {
            const new_data = res.data?.data || undefined;
            if (new_data) {
                let data = form_data_transfor_diy_data(new_data);
                // 配置信息
                data.overall_config = Object.assign({}, cloneDeep(form.value.overall_config), data.overall_config);
                data.overall_config.style_settings = overall_config_merge(data.overall_config.style_settings);
                // 详细数据新增字段添加
                data.diy_data = data_merge(data.diy_data);
                form.value = data;
                // 公共配置信息
                common_store.set_form_layout(form.value.overall_config.style_settings);
                common_store.set_config(form.value.overall_config);
                common_store.set_model_config(form.value.model);
            } else {
                is_empty.value = true;
            }
            loading_event();
        });
    } else {
        // 公共配置信息
        common_store.set_form_layout(form.value.overall_config.style_settings);
        common_store.set_config(form.value.overall_config);
        common_store.set_model_config(form.value.model);
        loading_event();
    }
};
const data_merge = (list: string[]) => {
    list.forEach((item: any) => {
        item.com_data = default_merge(item.com_data, item.key);
    });
    return list;
};
// 浅层数据合并
const default_merge = (data: any, key: string) => {
    if (data) {
        data = Object.assign({}, cloneDeep((defaultSettings as any)[key.replace(/-/g, '_')]), data);
    } else {
        data = cloneDeep((defaultSettings as any)[key.replace(/-/g, '_')]);
    }
    return data;
};
// 表单配置数据更新
const overall_config_merge = (data: any) => {
    if (data) {
        data.computer = Object.assign({}, cloneDeep(form.value.overall_config.style_settings.computer), data.computer);
        data.mobile = Object.assign({}, cloneDeep(form.value.overall_config.style_settings.mobile), data.mobile);
    } else {
        data = cloneDeep(form.value.overall_config.style_settings);
    }
    return data;
};
const form_data_transfor_diy_data = (clone_form: formData) => {
    let temp_config = clone_form.config;
    let new_tem_form = cloneDeep(form.value);
    try {
        return {
            id: clone_form.id,
            model: {
                logo: clone_form.logo,
                name: clone_form.name,
                is_enable: clone_form.is_enable,
                describe: clone_form.describe,
            },
            overall_config: is_obj(temp_config) ? (temp_config as formConfig).overall_config : JSON.parse(temp_config as string).overall_config,
            diy_data: is_obj(temp_config) ? (temp_config as formConfig).diy_data : JSON.parse(temp_config as string).diy_data,
        };
    } catch (error) {
        return {
            id: clone_form.id,
            model: {
                logo: clone_form.logo,
                name: clone_form.name,
                is_enable: clone_form.is_enable,
                describe: clone_form.describe,
            },
            overall_config: new_tem_form.overall_config,
            diy_data: new_tem_form.diy_data,
        };
    }
};
// 加载动画
const loading = ref(true);
const loading_content = ref(true);
const loading_event = () => {
    loading_content.value = false;
    setTimeout(() => {
        loading.value = false;
    }, 1000);
};
// 将内容传递给子组件, 避免多次传递
provide('diy_data', computed(() => form.value.diy_data));
// 表单配置
const is_show_form_model = ref(false);
// 表单配置 事件
const form_config_event = () => {
    // 生成随机id
    key.value = Math.random().toString(36).substring(2);
    is_show_form_model.value = !is_show_form_model.value;
};
// 预览信息
const previewVisible = ref(false);
const previewKey = ref('');
const preview_event = () => {
    save_disabled.value = true;
    save_formmat_form_data(form.value, false, false, true);
}
// 模式切换的时候清空缓存数据
const type_change = () => {
    form.value.diy_data = [];
}
//#region 保存逻辑
const save_disabled = ref(false);
// 保存
const save_event = () => {
    save_disabled.value = true;
    save_formmat_form_data(form.value);
}
// 保存并关闭
const save_close_event = () => {
    save_disabled.value = true;
    save_formmat_form_data(form.value);
}
const export_data_event = () => {
    save_formmat_form_data(form.value, false, true);
}
const import_temp_visible_dialog = ref(false);
// 导入数据
const import_data_event = () => {
    import_temp_visible_dialog.value = true;
};
const handleImportConfirm = () => {
    // 导入成功
    init();
};
const clear_event = () => {
    app?.appContext.config.globalProperties.$common.message_box('清空后不可恢复，确定继续吗?', 'warning').then(() => {
        diy_data_item.value = {};
        form.value.diy_data = [];
    });
}
// save_formmat_form_data: 保存数据， data： 数据， close： 是否关闭， is_export： 是否导出， is_preview： 是否预览
const save_formmat_form_data = (data: form_data_item, close: boolean = false, is_export: boolean = false, is_preview: boolean = false) => {
    ElMessage({
        message: '保存中',
        type: 'success',
        duration: 0,
        icon: 'Loading',
        customClass: 'message-box-custom',
    })
    const clone_form = cloneDeep(data);
    clone_form.diy_data.forEach((item: any) => { 
        item.show_tabs = '0';
        item.common_style = common_styles_computer(item.com_data.common_config);
        // 子表单需要统一规整一下数据
        if (item.key == 'subform') {
            const { com_data } = item;
            item.com_data.data_list = [];
            let data_list: any[] = [];
            com_data.form_value.forEach((item1: string) => {
                com_data?.children.forEach((item_data: any, index: number) => {
                    item_data.com_data.left_sticky = left_sticky(index + 1, item.com_data, com_data?.children);
                    item_data.common_style =  common_styles_computer(item_data.com_data.common_config);
                    // 格式化日期
                    if (['date', 'date-group'].includes(item_data.key)) { 
                        const data = new Map(date_style_options(item_data.com_data.date_style).map(item => [item.value, item]));
                        const new_format = data.get(item_data.com_data.date_type)?.label || 'yyyy-MM-DD HH:mm:ss';
                        item_data.com_data.format = new_format.replaceAll('Y', 'y').replaceAll('D', 'd').replaceAll('S', 's');
                    }
                })
                const data = JSON.parse(JSON.stringify(com_data?.children || []));
                if (data.length > 0) {
                    data.forEach((child: any) => {
                        child.common_style = common_styles_computer(child.com_data.common_config);
                        if (!isEmpty(item1[child.id])) {
                            child.com_data.form_value = item1[child.id];
                        }
                        if (['date', 'date-group'].includes(child.key)) { 
                            const com_data = child.com_data;
                            if (child.key == 'date') {
                                child.com_data.new_form_value = time_stamp(com_data.form_value, com_data.date_style, com_data.data_type);
                            } else {
                                child.com_data.new_form_value = [];
                                if (com_data.form_value.length > 0) {
                                    child.com_data.new_form_value = com_data.form_value.map((item: any) => time_stamp(item, com_data.date_style, com_data.data_type));
                                }
                            }
                        }
                    });
                    data_list.push({
                        is_expand: false,
                        data_list: data
                    });
                }
            });
            item.com_data.data_list = data_list;
        } else if (['date', 'date-group'].includes(item.key)) { 
            const com_data = item.com_data;
            const data = new Map(date_style_options(item.com_data.date_style).map(item => [item.value, item]));
            const new_format = data.get(item.com_data.date_type)?.label || 'yyyy-MM-DD HH:mm:ss';
            item.com_data.format = new_format.replaceAll('Y', 'y').replaceAll('D', 'd').replaceAll('S', 's');
            if (item.key == 'date') {
                item.com_data.new_form_value = time_stamp(com_data.form_value, com_data.date_style, com_data.data_type);
            } else {
                item.com_data.new_form_value = [];
                if (com_data.form_value.length > 0) {
                    item.com_data.new_form_value = com_data.form_value.map((item: any) => time_stamp(item, com_data.date_style, com_data.data_type));
                }
            }
        }
    });
    //数据改造
    const new_data = diy_data_transfor_form_data(clone_form);
    ForminputAPI.save(new_data)
        .then((res) => {
            setTimeout(() => {
                save_disabled.value = false;
            }, 500);
            ElMessage.closeAll();
            setTimeout(() => {
                // 如果是导出或预览模式，则不显示保存成功的消息
                if (!(is_export || is_preview)) {
                    ElMessage.success('保存成功');
                }
            }, 100);
            if (close) {
                ElMessageBox.confirm('您确定要关闭本页吗？', '提示')
                    .then(() => {
                        // 关闭页面
                        window.close();
                    })
                    .catch(() => {});
            } else {
                 // 判断是否需要导出
                 if (is_export) {
                    const index = window.location.href.lastIndexOf('?s=');
                    const pro_url = window.location.href.substring(0, index);
                    const new_url = import.meta.env.VITE_APP_BASE_API == '/dev-api' ? import.meta.env.VITE_APP_BASE_API_URL : pro_url;
                    window.open(new_url + '?s=forminputapi/forminputdownload/id/' + res.data + '.html', '_blank');
                }
                if (is_preview) {
                    previewVisible.value = true;
                }
                form.value.id = String(res.data);
                history.pushState({}, '', '?s=forminput/saveinfo/id/' + res.data + '.html');
            }
        })
        .catch((err: string) => {
            // 失败的时候关闭弹出框
            ElMessage.closeAll();
            if (err == 'canceled') {
                console.log('请求已取消');
            } else {
                ElMessage.error(err || '系统出错');
            }
            save_disabled.value = false;
        });
};
/**
 * 计算左侧粘性定位样式
 * 
 * @param index - 当前元素的索引位置
 * @returns 返回CSS粘性定位样式字符串，若不符合条件则返回空字符串
 */
 const left_sticky = (index: number, com_data: any, children: any) => {
    // 从表单数据中获取是否启用固定和固定数量配置
    const { is_fixed = '0', fixed_num = 1 } = com_data?.computer || {};
    
    // 检查是否满足粘性定位条件：启用固定且索引在固定数量范围内
    if (is_fixed !== '1' || index >= fixed_num || fixed_num <= 0) {
        return '';
    }
    // 初始左侧偏移量：第一个元素为0，其他元素默认78px
    let left = index === 0 ? 0 : 78;
    // 计算当前元素之前的兄弟元素宽度总和作为偏移量
    if (index > 0) {
        for (let i = 1; i < index; i++) {
            left += children[i - 1]?.com_data?.com_width || 0;
        }
    }
    
    // 生成粘性定位CSS样式
    return `position: sticky;left: ${left}px;z-index: 3;`;
}
const diy_data_transfor_form_data = (clone_form: form_data_item) => {
    return {
        id: clone_form.id,
        logo: clone_form.model.logo,
        name: clone_form.model.name,
        is_enable: clone_form.model.is_enable,
        describe: clone_form.model.describe,
        config: JSON.stringify({
            diy_data: clone_form.diy_data,
            overall_config: clone_form.overall_config
        }),
    };
};
//#endregion
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

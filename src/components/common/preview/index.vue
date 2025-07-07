<template>
    <el-dialog v-model="dialogVisible" class="layout-dialog form-dialog" fullscreen :close-on-press-escape="false" close-on-click-modal :append-to-body="false" :before-close="handleClose">
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
        <div class="flex-row h w re">
            <div class="abs w h" :style="content_style">
                <!-- 背景信息 -->
                <image-empty v-if="!isEmpty(config_value.background_image[0])" v-model="config_value.background_image[0]" fit="contain" error-style="width:100%;height:100%;"></image-empty>
            </div>
            <div v-if="type_value == 'computer'" class="flex-1 dialog-main z-i re z-i w h flex-row align-c jc-c">
                <!-- 表单数据 -->
                <div class="main-overflow w h">
                    <template v-if="common_store.form_config.type_value == 'free'">
                        <div class="main-custom-content oh" :style="`margin:0 auto;width: ${ common_store.form_config.custom_width }px;`">
                            <layout-top></layout-top>
                            <div class="re bg-f oh" :style="`width: ${ common_store.form_config.custom_width }px;height: ${ common_store.form_config.custom_height }px;margin: 0 auto;`">
                                <div v-for="(item, index) in filteredDiyData" :key="item.id" :data-id="item.id" :class="['free-main-content flex-row oh', { 'required-error': item.com_data.common_config.is_error == '1' }]" :style="`left: ${ item.location.x }px; top: ${ item.location.y }px; width: ${ item.com_data.com_width }px; height: ${ item.com_data.com_height }px;z-index: ${ item.is_enable == '1' ? ((filteredDiyData.length - 1) - index + 1) : -999};`">
                                    <component-show :value="item" :is-custom="true" :is-preview="true" :is-show="true"></component-show>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="main-content oh" :style="{ 'min-height': (form_config.is_show_submit == '1' || form_config.is_show_save_draft == '1') ? 'calc(100% - 8rem)' : '100%' }">
                            <layout-top></layout-top>
                            <div class="pa-16">
                                <div v-for="item in filteredDiyData" :key="item.id" :class="['component-style', { 'required-error': item.com_data.common_config.is_error == '1' }]">
                                    <component-show :value="item" :is-preview="true" :is-show="true"></component-show>
                                </div>
                            </div>
                        </div>
                    </template>
                    <!-- 底部数据 -->
                    <div v-if="form_config.is_show_submit == '1' || form_config.is_show_save_draft == '1'" class="main-footer-overflow">
                        <div class="main-footer flex-row align-c jc-e gap-20 right-0" :style="`width: ${ common_store.form_config.type_value == 'free' ? common_store.form_config.custom_width : 1000}px;`">
                            <el-button v-if="form_config.is_show_save_draft == '1'" plain @click="save_draft">{{form_config.save_draft_title }}</el-button>
                            <el-button v-if="form_config.is_show_submit == '1'" dark :color="form_config.style_settings.computer.submit_color" @click="submit"><span style="color:#fff;">{{ form_config.submit_title }}</span></el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { commonStore } from "@/store";
import { checkbox_range_handle, get_format_checks, get_format_checks_v2, get_id, get_region_names_by_id, isEmpty, number_range_handle } from "@/utils";
import formSaveAPI from "@/api/formSave";
import { cloneDeep } from "lodash";
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
    diy_data.value = cloneDeep(props.value);
}, { immediate: true, deep: true});
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
    ElMessage.warning('当前状态下不支持该操作');
};
// 定义字段类型与检查参数的映射
const fieldCheckMap: arrayIndex = {
    'address': { is_format: false, type: 'address' },
    'number': { is_format: false, type: 'number' },
    'checkbox': { is_format: true, type: 'checkbox' },
    'select-multi': { is_format: true, type: 'checkbox' },
    'date': { is_format: false, type: 'time' },
    'date-group': { is_format: false, type: 'time' },
    'single-text': { is_format: false, type: '' },
    'multi-text': { is_format: false, type: '' },
    'rich-text': { is_format: false, type: '' },
    'radio-btns': { is_format: false, type: 'radio' },
    'select': { is_format: false, type: 'select' },
    'pwd': { is_format: false, type: '' },
    'score': { is_format: false, type: 'score' },
    'upload-attachments': { is_format: false, type: 'upload' },
    'upload-img': { is_format: false, type: 'upload' },
    'upload-video': { is_format: false, type: 'upload' }
};
// 提交数据校验
const submit_data_check = () => {
     // 遍历所有过滤后的自定义数据项
     filteredDiyData.value?.forEach((item: any) => {
        const com_data = item.com_data;
        // 跳过非必填项
        if (com_data.is_required === '1') {
            // 特殊字段验证：手机号
            if (item.key === 'phone') {
                handlePhoneValidation(com_data);
            } 
            // 其他字段的格式验证
            else if (fieldCheckMap[item.key]) {
                const { is_format, type } = fieldCheckMap[item.key];
                get_format_checks(com_data, is_format, type);
            }
        };
        /**
         * 子表单处理逻辑
         * 1. 检查子表单中是否有必填项
         * 2. 验证子表单整体必填性
         * 3. 处理子表单内各字段的验证
         */
        if (item.key === 'subform') {
            // 子表单整体必填验证
            if (com_data.is_required === '1' && com_data.form_value.length <= 0 && com_data.children.value.length > 0) {
                com_data.common_config.is_error = '1';
                com_data.common_config.error_text = '请填写至少一条记录';
            } else {
                com_data.common_config.is_error = '0';
                com_data.common_config.error_text = '';
            }
            // 处理子表单内各字段的验证
            if (com_data.children.length > 0 && com_data.form_value.length > 0) {
                // 获取子表单数据并检查是否有必填项
                const subform_data = filtered_Data(com_data.children, com_data.form_value, 'all');
                const hasRequired = subform_data.some(item => item.com_data.is_required === '1');
                
                // 没有必填项则跳过
                if (!hasRequired) return;

                com_data.form_error_list = [];
                // 初始化错误列表
                com_data.form_value.forEach((item: any, index: number) => {
                    if (isEmpty(com_data.form_error_list[index])) {
                        const data: any = {};
                        com_data.children.forEach((item1: any) => {
                            if (isEmpty(item[item1.id])) {
                                data[item1.id] = { common_config: { is_error: '0', error_text: '' } };
                            }
                        });
                        com_data.form_error_list[index] = data;
                    }
                });

                // 验证子表单内各字段
                com_data.form_value.forEach((form_item: any, index: number) => {
                    // 取出对应列的数据信息
                    const form_data = filtered_Data(com_data.children, com_data.form_value, 'index', index);
                    form_data.forEach((data_item: any) => {
                        // 跳过非必填项
                        if (data_item.com_data.is_required !== '1') return;
                        // 执行字段验证
                        const checkConfig = fieldCheckMap[data_item.key];
                        if (checkConfig) {
                            subform_data_check(checkConfig.is_format, checkConfig.type, index, data_item.id, data_item.com_data, com_data.form_error_list, com_data.form_value);
                        }
                    });
                });
            }
        }
    });
} 
/**
 * 提交表单数据并进行验证
 * 
 * 功能说明：
 * 1. 遍历过滤后的自定义数据，对必填字段进行验证
 * 2. 处理特殊字段（如手机号）的验证
 * 3. 处理子表单的验证逻辑，包括必填项检查和格式验证
 */
 const submit = () => {
    // 校验所有的必填项和逻辑
    submit_data_check();
    // 处理所有的错误项
    const data = filteredDiyData.value.find((item: any) => item.com_data.common_config.is_error === '1' || (item.key === 'subform' && item.com_data.form_error_list.some((item1: any) => item1[Object.keys(item1)[0]].common_config.is_error === '1')));
    if (!isEmpty(data)) {
        if (data.key === 'subform') {
            if (data.com_data.common_config.is_error == '1') {
                ElMessage.error(`${data.com_data.title}「${data.com_data.common_config.error_text}」`);
            } else {
                ElMessage.error(`请检查${data.com_data.title}内的填写`);
            }
        } else {
            ElMessage.error(`${data.com_data.title}「${data.com_data.common_config.error_text}」`);
        }
    } else {
        submit_data_parameter_handle();
    }
}
const submit_data_parameter_handle = () => {
    const submit_data: arrayIndex = {};
    const filter_data = ['video', 'img', 'auxiliary-line', 'position', 'rect', 'round', 'text', 'attachments'];
    // 规整字段信息
    filteredDiyData.value.forEach((item: any) => {
        if (!filter_data.includes(item.key)) {
            const name = isEmpty(item.form_name) ? item.id : item.form_name;
            const value = isEmpty(item.com_data.form_value) ? '' : item.com_data.form_value;
            const com_data = item.com_data;
            if (item.key ==='subform') {
                submit_data[name] = com_data.form_value.map((subform_item: any) => {
                    const data: any = {};
                    com_data.children.forEach((item1: any) => {
                        const subform_name = isEmpty(item1.form_name) ? item1.id : item1.form_name;
                        const subform_value = isEmpty(subform_item[item1.id]) ? '' : subform_item[item1.id];
                        if (!filter_data.includes(item1.key)) {
                            if (item1.key == 'address') {
                                data[`${ subform_name }_province_id`] = subform_value[0] || '';
                                data[`${ subform_name }_city_id`] = subform_value[1] || '';
                                data[`${ subform_name }_county_id`] = subform_value[2] || '';
                                // 省市区中文名称
                                const address_name = get_region_names_by_id(common_store.address_list, subform_value);
                                submit_data[`${ name }_province_name`] = address_name[0] || '';
                                submit_data[`${ name }_city_name`] = address_name[1] || ''
                                submit_data[`${ name }_county_name`] = address_name[2] || ''
                            } else {
                                data[subform_name] = subform_value;
                            }
                        }
                    });
                    return data;
                });
            } else if (item.key ==='phone') {
                submit_data[`${ name }`] = value || '';
                // 判断是否需要发送短信验证码
                if (com_data.is_sms_verification == '1') {
                    submit_data[`${ name }_verify`] = com_data?.form_value_code || '';
                }
            } else if (item.key == 'address') {
                submit_data[`${ name }_province_id`] = value[0] || '';
                submit_data[`${ name }_city_id`] = value[1] || '';
                submit_data[`${ name }_county_id`] = value[2] || '';
                // 省市区中文名称
                const address_name = get_region_names_by_id(common_store.address_list, value);
                submit_data[`${ name }_province_name`] = address_name[0] || '';
                submit_data[`${ name }_city_name`] = address_name[1] || ''
                submit_data[`${ name }_county_name`] = address_name[2] || ''
                // 判断类型是否包含详细地址
                if (com_data.address_type == 'detailed') {
                    submit_data[`${ name }_address`] = com_data?.detailed_value || '';
                }
            } else if (['select', 'radio-btns'].includes(item.key)) {
                submit_data[name] = value;
                const value_list = com_data.option_list.filter((item: any) => item.is_other == '1');
                if (value_list.length > 0) {
                   submit_data[`${ name }_other_value`] = com_data?.other_value || '';
                }
            } else {
                submit_data[name] = value;
            }
        }
    });
    const params = {
        forminput_id: get_id(),
        ...submit_data
    }
    formSaveAPI.dataSave(params).then((res: any) => {
        ElMessage.success('提交成功');
    })
}
// 处理手机号验证逻辑
const handlePhoneValidation = (com_data: any) => {
    if (com_data.is_sms_verification === '1' && com_data.is_required === '1' && isEmpty(com_data.form_value_code)) {
        com_data.common_config.is_error = '1';
        com_data.common_config.error_text = '短信验证码不能为空';
        return;
    }
    com_data.common_config.format = com_data.is_telephone === '1' ? 'telephone-number' : 'phone-number';
    get_format_checks(com_data, true);
};
// 子表单显隐规则数据处理
const filtered_Data = (children: any[], form_value: any[], type: string, index?: number) => { 
    const componentMap = new Map(children.map((item: any) => [item.id, item])) as any;

    // 取出所有设置显隐规则的组件
    const list = children.filter((item: any) => ['single-text', 'select', 'radio-btns'].includes(item.key) && ['select', 'radio-btns'].includes(item.com_data.type) && item.com_data.show_hidden_list.length > 0);
    const list_map = list.map((item: DiyItem) => ({ id: item.id, list: item.com_data.show_hidden_list }));
    return children.filter((item: DiyItem) => {
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
                    if (type == 'all') {
                        // 判断所有的是否满足条件
                        const data = form_value.filter((form_item: any) => form_item[list_item.id].includes(hidden_item.value))
                        return data.length > 0;
                    } else {
                        // 判断是单个还是多个内容
                        if (index == null) {
                            return false;
                        } else {
                            // 否则判断当前组件的值是否存在
                            return form_value[index][list_item.id].includes(hidden_item.value);
                        }
                    }
                } else {
                    return true;
                }
            });
        });
        return isShownByRule;
    });
};
// 子表单内部校验逻辑
const subform_data_check = (is_format: boolean, type: string, index: number, id: string, com_data: any, form_error_list: any[], value: any[]) => {
    const data = form_error_list[index][id];
    const form_value = value[index][id];
    if (isEmpty(data)) {
        return 
    }
    // 判断是否是必填字段,并且没有值
    if (com_data.is_required == '1' && isEmpty(form_value)) {
        // 是否报错显示
        data.common_config.is_error = '1';
        data.common_config.error_text = `此项为${['select', 'checkbox', 'upload', 'time', 'address', 'score', 'radio'].includes(type) ? '必选' : '必填'}项`;
    } else {
        // 否就清除报错显示
        data.common_config.is_error = '0';
        data.common_config.error_text = '';
        if (is_format) {
            if (type == 'number') {
                // 数字组件的校验逻辑
                number_range_handle(com_data, form_value);
            } else if (type == 'checkbox') {
                // 复选框和复选下拉框的校验逻辑
                checkbox_range_handle(com_data, form_value);
            } else {
                // 单行文本的校验逻辑
                // 对字段进行格式检查
                get_format_checks_v2(com_data.common_config, form_value);
            }
        }
    } 
};
//#endregion
// 配置信息，区分是手机端数据还是电脑端数据
const config_value = computed(() => type_value.value == 'computer' ? common_store.form_config.style_settings.computer : common_store.form_config.style_settings.mobile);

const content_style = computed(() => `background:${ config_value.value.background_color }`);
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

        :deep(.el-radio-button__inner) {
            color: #2A94FF !important;
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
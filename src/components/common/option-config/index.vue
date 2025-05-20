<template>
    <el-form-item label-width="0">
        <div class="flex-col gap-10 w h">
            <div class="new_title flex-row align-c jc-sb">选项
                <div class="flex-row align-c gap-5 right-title">彩色<el-switch v-model="multicolour" active-value="1" inactive-value="0"></el-switch></div>
            </div>
            <template v-if="multiple">
                <el-checkbox-group v-model="checkValue">
                    <drag class="w" :data="drag_list.filter(item => item.is_outer !== '1')" :space-col="20" @remove="remove" @on-sort="on_sort">
                        <template #default="{ row, index }">
                            <el-checkbox :value="row.value" class="option-width">
                                <el-tooltip effect="dark" :show-after="200" :hide-after="200" content="不允许重复选项" popper-class="custom-error-tooltip" :disabled="!is_error(row.name)" :show-arrow="false" raw-content placement="top-start">
                                    <el-input v-model="row.name" :class="['option-width', {'is-error': is_error(row.name)}]" @change="input_change(row.name, index)"></el-input>
                                </el-tooltip>
                                <template v-if="multicolour == '1'">
                                    <el-color-picker v-model="row.color" :predefine="predefine_colors" @click.prevent />
                                </template>
                            </el-checkbox>
                        </template>
                    </drag>
                    <div v-if="is_drag_outer" class="flex-row align-c gap-y-16 sort-target w mt-10">
                        <el-checkbox :value="last_drag_item.value" class="option-width">
                            <el-tooltip effect="dark" :show-after="200" :hide-after="200" content="不允许重复选项" popper-class="custom-error-tooltip" :disabled="!is_error(last_drag_item.name)" :show-arrow="false" raw-content placement="top-start">
                                <el-input v-model="last_drag_item.name" :class="['option-width', {'is-error': is_error(last_drag_item.name)}]" @change="input_change(last_drag_item.name, drag_list.length - 1)"></el-input>
                            </el-tooltip>
                        </el-checkbox>
                        <icon name="delete-o" size="18" color="6" @click="remove(drag_list.length - 1)"/>
                    </div>
                </el-checkbox-group>
            </template>
            <template v-else>
                <el-radio-group v-model="radioValue">
                    <drag class="w" :data="drag_list.filter(item => item.is_outer !== '1')" :space-col="20" @remove="remove" @on-sort="on_sort">
                        <template #default="{ row, index }">
                            <el-radio :value="row.value" class="option-width">
                                <el-tooltip effect="dark" :show-after="200" :hide-after="200" content="不允许重复选项" popper-class="custom-error-tooltip" :disabled="!is_error(row.name)" :show-arrow="false" raw-content placement="top-start">
                                    <el-input v-model="row.name" :class="['option-width', {'is-error': is_error(row.name)}]" @change="input_change(row.name, index)"></el-input>
                                </el-tooltip>
                                <template v-if="multicolour == '1'">
                                    <el-color-picker v-model="row.color" :predefine="predefine_colors" @click.prevent />
                                </template>
                            </el-radio>
                        </template>
                    </drag>
                    <div v-if="is_drag_outer" class="flex-row align-c gap-y-16 sort-target w mt-10">
                        <el-radio :value="last_drag_item.value" class="option-width">
                            <el-tooltip effect="dark" :show-after="200" :hide-after="200" content="不允许重复选项" popper-class="custom-error-tooltip" :disabled="!is_error(last_drag_item.name)" :show-arrow="false" raw-content placement="top-start">
                                <el-input v-model="last_drag_item.name" :class="['option-width', {'is-error': is_error(last_drag_item.name)}]" @change="input_change(last_drag_item.name, drag_list.length - 1)"></el-input>
                            </el-tooltip>
                        </el-radio>
                        <icon name="delete-o" size="18" color="6" @click="remove(drag_list.length - 1)"/>
                    </div>
                </el-radio-group>
            </template>
            <div class="flex-row align-c gap-4 ml-32">
                <span class="add-title" @click="add">添加选项</span>|
                <template v-if="isOuter">
                    <span :class="['add-title', { 'outer-disable': is_drag_outer}]" @click="add_outer">添加其他选项</span>|
                </template>
                <span class="add-title" @click="bulk_edit">批量编辑</span>
            </div>
        </div>
    </el-form-item>
    <el-dialog v-model="dialogVisible" title="批量编辑" width="40%" align-center :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
        <div class="flex-col gap-10 mtb-20">
            <div class="dialog-desc">每行对应一个选项</div>
            <el-input v-model="textarea" :rows="20" type="textarea" />
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup> 
import { isEmpty, cloneDeep } from 'lodash';
import { color_change, predefine_colors } from '@/utils/common';
import { get_math } from "@/utils/index";
// 弹出框显示逻辑
const multicolour = defineModel('multicolour', { type: String, default: '0' })
// 默认值处理
const radioValue = defineModel('radioValue', { type: String, default: '' });
const checkValue = defineModel('checkValue', { type: Array as PropType<string[]>, default: [] });
const outer_data = {
    name: '其他',
    value: 'outer',
    is_outer: '1',
    color: '#051e500a',
}
interface Props {
    list: any[];
    multiple: boolean;
    isOuter?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    imgParams: 'cover',
    isOuter: true,
    multiple: false,
});

const drag_list = ref(props.list);
watchEffect(() => {
    drag_list.value = props.list;
});
/**
 * 计算属性，用于判断拖拽的项目是否是外部项目
 * 
 * 此处无需参数说明，因为该计算属性依赖于外部的 drag_list.value
 * 
 * @returns {boolean} 如果最后一个项目是外部项目，则返回 true；否则返回 false
 */
 const is_drag_outer = computed(() => {
    // 获取拖拽列表
    const list = drag_list.value;
    // 如果列表为空或不存在，则认为没有外部项目
    if (!list || list.length === 0) return false;

    // 获取列表中的最后一个项目
    const last = list[list.length - 1];
    // 判断并返回最后一个项目是否为外部项目
    return last.is_outer === '1';
});

const emits = defineEmits(['onsort', 'option-change']);
// #region 添加选项
const add = () => {
    let length = drag_list.value.length;
    // 判断最后一个是否是其他
    if (is_drag_outer.value) {
        length = length - 1;
    }
    const data = {
        name: '选项' + (length + 1),
        value: 'option' + get_math(),
        color: color_change(length),
    }
    // 判断最后一个是否是其他
    if (is_drag_outer.value) {
        drag_list.value.splice(length, 0, data);
    } else {
        drag_list.value.push(data);
    }
};
const add_outer = () => {
    if (!is_drag_outer.value) {
        drag_list.value.push(outer_data);
    }
}
// #endregion
// #region 输入框操作逻辑和校验
const last_drag_item = computed(() => drag_list.value[drag_list.value.length - 1]);
const input_change = (val: string, index: number) => {
    if (!isEmpty(val)) {
        drag_list.value[index].name = val;
    } else {
        drag_list.value[index].name = '选项';
    }
}
const is_error = computed(() => {
    return (val: string) => {
        return drag_list.value.filter(item => item.name === val).length > 1;
    }
});
//#endregion
//#region 批量编辑
const dialogVisible = ref(false);
const textarea = ref('');
// 点击编辑的时候将数组转变成字符串
const bulk_edit = () => {
    let old_data = cloneDeep(Array.isArray(drag_list.value) ? drag_list.value : []);
    // 判断是否有其他内容，如果有的话删除最后一个
    if (is_drag_outer.value) {
        old_data.splice(drag_list.value.length - 1, 1);
    }
    const names = old_data.map(item => item.name ?? '').join('\n');
    textarea.value = names;
    dialogVisible.value = true;
}
const cancel = () => {
    dialogVisible.value = false;
}
// 点击确定之后将数据转变成数组
const submit = () => {
    // 去掉首尾空格之后做数据处理
    const textarea_value = (textarea.value || '').trim().split(/[\r\n]+/g);
    let data: any[] = []
    if (textarea_value.length > 0) {
        data = textarea_value.map((item: any, index: number) => {
            return {
                name: item,
                value: 'option' + get_math(),
                color: color_change(index),
            }
        });
    }
    if (is_drag_outer.value) {
        const new_data = cloneDeep([...data, outer_data]);
        emits('onsort', new_data);
    } else {
        emits('onsort', data);
    }
    // 批量编辑之后清除数据
    if (props.multiple) {
        checkValue.value = [];
    } else {
        radioValue.value = '';
    }
    // 关闭弹出框
    dialogVisible.value = false;
}
//#endregion
//#region 操作逻辑
// 拖拽之后的顺序
const on_sort = (item: any) => {
    if (is_drag_outer.value) {
        const new_data = cloneDeep([...item, outer_data]);
        emits('onsort', new_data);
    } else {
        emits('onsort', item);
    }
};
// 删除选项时的操作
const remove = (index: number) => {
    // 防止 index 越界
    if (index < 0 || index >= drag_list.value.length) {
        return;
    }
    // 先删除数据，然后判断是否存在
    drag_list.value.splice(index, 1);
    const new_data = cloneDeep(drag_list.value.map(item => item.value ?? ''));
    if (props.multiple) {
        if (!isEmpty(checkValue.value)) {
            checkValue.value = checkValue.value.filter((item: any) => new_data.includes(item));
            return;
        }
    } else {
        if (!isEmpty(radioValue.value)) {
            if (!new_data.includes(radioValue.value)) {
                radioValue.value = '';
            }
            return;
        }
    }
};
//#endregion

watch(() => drag_list.value, (new_value) => {
    const newListLength = new Set(new_value.map(item => item.name)).size;
    const listLength = new_value.length;
    if(listLength > newListLength){
        emits('option-change', false);
    } else {
        emits('option-change', true);
    }
}, { immediate: true, deep: true });
</script>

<style lang="scss" scoped>
:deep(.sort-target) {
    .el-radio {
        margin-right: 0 !important;
    }
}
.option-width {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    :deep(.el-radio__label), :deep(.el-checkbox__label) {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
    }
}
.right-title {
    font-size: 1.2rem;
    font-weight: 400;
}
.add-title {
    cursor: pointer;
    font-size: 1.4rem;
    color: $cr-main;
}
.outer-disable {
    cursor: no-drop;
    color: #B5B8BE;
}
.dialog-desc {
    font-size: 1.4rem;
    line-height: 2.2rem;
    color: #838892;
}
.is-error {
    :deep(.el-input__wrapper) {
        box-shadow: #D8423A 0px 0px 0px 1px inset;
    }
}
</style>
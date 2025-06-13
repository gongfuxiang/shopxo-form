<template>
    <div class="flex-col gap-10">
        <div class="flex-row align-c">
            <template v-if="is_remove_selected">
                <el-button class="custom-button" @click="remove_handle">取消操作</el-button>
                <el-button class="custom-button" @click="remove_selected">删除选中</el-button>
            </template>
            <template v-else>
                <el-button class="custom-button" type="primary" @click="add"><icon name="xzdz-tianjiabiaoq" size="14"></icon>添加</el-button>
                <el-button v-if="form.form_value.length > 0" class="custom-button" @click="remove_handle"><icon name="delete" size="14"></icon>删除</el-button>
            </template>
        </div>
        <div class="subform flex-row">
            <div class="table-container rendering-area">
                <div class="table-header flex-row align-c">
                    <div class="head-label flex-row align-c jc-c shrink table-sticky">
                        <el-checkbox v-if="is_remove_selected" v-model="selectAll" :indeterminate="indeterminate" @change="handleCheckAllChange" />
                    </div>
                    <!-- 头部标题显示 -->
                    <div v-for="item in children" :key="item.id" class="item-label flex-row align-c shrink" :style="`width: ${ item.com_data.com_width }px;`">
                        <span v-if="item.com_data.is_required == '1'" class="required">*</span>
                        {{ item.com_data.title }}
                        <tooltip v-if="item.com_data.common_config.help_is_show == '1'" :content="item.com_data.common_config.help_explain" :size="common_store.help_icon_size"></tooltip>
                    </div>
                </div>
                <div class="table-body">
                    <!-- <el-checkbox-group :model-value="selected_list" class="flex-1 flex-col selected-checkbox" @change="checkbox_change"> -->
                    <div v-for="(item, index) in form.form_value" :key="index + get_math()" class="table-row w flex-row" >
                        <div class="cell-num flex-row align-c jc-c shrink table-sticky">
                            <template v-if="is_remove_selected && selected_list.length > 0">
                                <el-checkbox v-model="selected_list[index]" :value="index" />
                            </template>
                            <template v-else>
                                <div class="row-num flex-row align-c jc-c">
                                    <template v-if="isEmpty(line_error(index))">
                                        {{ index + 1 }}
                                    </template>
                                    <template v-else>
                                        <div class="error-icon">!</div>
                                    </template>
                                </div>
                                <el-tooltip effect="dark" :show-after="200" :hide-after="200" :content="line_error(index)" :disabled="isEmpty(line_error(index))" popper-class="custom-error-tooltip" :show-arrow="false" raw-content placement="top-start">
                                    <div class="operate flex-row align-c jc-c gap-5">
                                        <icon name="enlarge" size="14" color="primary" @click="enlarge_click(index)"></icon>
                                        <el-popconfirm :key="index + get_math()" width="220" title="该条记录存在数据，数据删除后将无法恢复，确定删除？" :hide-after="0" @confirm="remove(index)">
                                            <template #reference>
                                                <icon name="delete" size="14" color="primary"></icon>
                                            </template>
                                            <template #actions="{ confirm, cancel }">
                                                <el-button size="small" @click="cancel">取消</el-button>
                                                <el-button type="danger" size="small" @click="confirm">确定</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-dropdown placement="bottom">
                                            <icon name="more-o" size="14" color="primary"></icon>
                                            <template #dropdown>
                                                <el-dropdown-menu>
                                                    <el-dropdown-item @click.stop="copy(index, 'bottom')">复制到下一行</el-dropdown-item>
                                                    <el-dropdown-item @click.stop="copy(index, 'last')">复制到最后一行</el-dropdown-item>
                                                    <el-dropdown-item @click.stop="insert(index, 'top')">向上插入一行</el-dropdown-item>
                                                    <el-dropdown-item @click.stop="insert(index, 'bottom')">向下插入一行</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </template>
                                        </el-dropdown>
                                    </div>
                                </el-tooltip>
                            </template>
                        </div>
                        <div v-for="children_item in children" :key="children_item.id" :class="['cell re flex-row align-c jc-c shrink', { 'item-row-error': error_list(index, children_item.id)[0] == '1' }]" :style="`width: ${ children_item.com_data?.com_width || 0 }px;`">
                            <template v-if="show_row(index, children_item.id)">
                                <el-tooltip effect="dark" :show-after="200" :hide-after="200" :content="error_list(index, children_item.id)[1]" popper-class="custom-error-tooltip" :disabled="error_list(index, children_item.id)[0] == '0'" :show-arrow="false" raw-content placement="top-start">
                                    <subform-rendering v-model="children_item.com_data" v-model:type="children_item.key" :value="item[children_item.id]" :index="index" @change="tablist_change($event, index, children_item.id)" @data_check="data_check($event, index, children_item.id, children_item.com_data)"></subform-rendering>
                                </el-tooltip>
                            </template>
                        </div>
                    </div>
                    <!-- </el-checkbox-group> -->
                </div>
            </div>
        </div>
    </div>
    <subform-drawer v-model:visible="drawer_visible" v-model:title="drawer_title" v-model:total="form.form_value.length" v-model:size="drawer_index" v-model:form_data="drawer_data" @previous-page="previous_page" @next-page="next_page" @add="drawer_add" @copy="drawer_copy" @change="drawer_change"></subform-drawer>
</template>

<script lang="ts" setup>
import { cloneDeep, isEmpty } from "lodash";
import { commonStore } from "@/store";
import { checkbox_range_handle, get_format_checks_v2, get_math, number_range_handle } from "@/utils";
const common_store = commonStore();
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    isPreview: {
        type: Boolean,
        default: false,
    },
    isDefault: {
        type: Boolean,
        default: false,
    }
});
const form = ref(props.value);
watch(() => props.value, (val) => {
    form.value = val;
}, {immediate: true, deep: true});
const form_error_list = ref<any[]>([]);
//#region 判断列是否显示，或者某一行的某一个是否显示
interface DiyItem {
    id: number | string;
    key: string;
    is_enable: string;
    com_data: any;
}
// 计算属性：根据显隐规则过滤出需要显示的组件
const filteredDiyData = computed(() => filtered_Data('all'));
// index: 列索引 id: 组件id
const show_row = (index: number, id: string) => {
    if (props.isPreview || props.isDefault) {
        const show_children = filtered_Data('value', index);
        const children_index = show_children.findIndex((item: any) => item.id === id);
        return children_index !== -1;
    } else {
        return true;
    }
};
// 判断childer符合显隐规则的数量
const filtered_Data = (type: string, index?: number) => { 
    const componentMap = new Map(form.value.children.map((item: any) => [item.id, item])) as any;

    // 取出所有设置显隐规则的组件
    const list = form.value.children.filter((item: any) => ['single-text', 'select', 'radio-btns'].includes(item.key) && ['select', 'radio-btns'].includes(item.com_data.type) && item.com_data.show_hidden_list.length > 0);
    const list_map = list.map((item: DiyItem) => ({ id: item.id, list: item.com_data.show_hidden_list }));
    return form.value.children.filter((item: DiyItem) => {
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
                        const data = form.value.form_value.filter((form_item: any) => form_item[list_item.id].includes(hidden_item.value))
                        return data.length > 0;
                    } else {
                        // 判断是单个还是多个内容
                        if (index == null) {
                            return false;
                        } else {
                            // 否则判断当前组件的值是否存在
                            return form.value.form_value[index][list_item.id].includes(hidden_item.value);
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
const children = computed(() => props.isPreview || props.isDefault ? filteredDiyData.value : form.value.children.filter((item: any) => item.is_enable === '1'));
//#endregion
// 表单数据发生变化时的处理
watch(() => form.value.form_value, (val) => {
    if (props.isPreview) {
        if (val.length > 0) {
            val.forEach((item: any, index: number) => {
                if (isEmpty(form_error_list.value[index])) {
                    const data: any = {};
                    children.value.forEach((item1: any) => {
                        if (isEmpty(item[item1.id])) {
                            data[item1.id] = { common_config: { is_error: '0', error_text: ''} };
                        }
                    });
                    form_error_list.value[index] = data;
                }
            });
        } else {
            form_error_list.value = [];
        }
    }
}, {immediate: true, deep: true});

const error_list = computed(() => { 
    return (index: number, id: string) => {
        if (!isEmpty(form_error_list.value[index]) && !isEmpty(form_error_list.value[index][id])) {
            const data = form_error_list.value[index][id];
            return [data.common_config.is_error, data.common_config.error_text];
        } else {
            return ['0', '']
        }
    }
});
const form_data = computed(() => {
    return children.value.reduce((acc: any, item: any) => {
        acc[item.id] = item.com_data.form_value;
        return acc;
    }, {});
});
//#region 表格操作
const remove = (index: number) => {
    form.value.form_value.splice(index, 1);
    // 如果没有数据了，就不显示删除按钮·
    if (form.value.form_value.length <= 0) {
        is_remove_selected.value = false;
    }
};
const add = () => {
    form.value.form_value.push(cloneDeep(form_data.value));
};
// 复制数据
const copy = (index: number, type: string) => {
    const data = cloneDeep(form.value.form_value[index]);
    if (type == 'last') {
        form.value.form_value.push(data);
    } else {
        form.value.form_value.splice(index, 0, data);
    }
};
const insert = (index: number, type: string) => {
    if (type == 'top') {
        // 如果是小于1的时候就将数据放在头部
        if (index - 1 <= 0) {
            form.value.form_value.splice(0, 0, cloneDeep(form_data.value));
        } else {
            form.value.form_value.splice(index - 1, 0, cloneDeep(form_data.value));
        }
    } else {
        form.value.form_value.splice(index + 1, 0, cloneDeep(form_data.value));
    }
};
// 子表单更新数据传递给父组件
const tablist_change = (val:any, index: number, id: string) => {
    form.value.form_value[index][id] = val;
};
//#endregion
//#region 删除操作
const is_remove_selected = ref(false);

const remove_handle = () => { 
    is_remove_selected.value = !is_remove_selected.value;
    // selected_list.value = [];
};
const remove_selected = () => {
    const list: any[] = [];
    // 过滤掉选中的项，直接删除，index为当前项的索引会乱，所以用一个新数组承接
    form.value.form_value.forEach((item: any, index: number) => {
        if (!selected_list.value[index]) {
            list.push(item);
        }
    });
    form.value.form_value = cloneDeep(list);
    if (form.value.form_value.length <= 0) {
        is_remove_selected.value = false;
    }
    // 删除完成之后，将所有的数据改为false
    selected_list.value = form.value.form_value.map((item: any, index: number) => false);
};
// 是否全选
const selectAll = ref(false);
const indeterminate = ref(true);
// 选中的内容
const selected_list = ref<number[]>([]);
// 选中时的操作
const checkbox_change = (val: any) => {
    selected_list.value = val;
};
// 全选反选时的操作
const handleCheckAllChange = () => {
    const val = form.value.form_value;
    // 如果是全选的话，就按照数据结构全部为true，否则的话是全部为false
    selected_list.value = selectAll.value ? form.value.form_value.map((item: any, index: number) => true) : val.map((item: any) => false)
};
// 监听数据发生变化
watchEffect(() => {
    const val = form.value.form_value;
    // 取出所以选中的项
    const new_selected_list = selected_list.value.filter(item => item);
    // 判断是全选还是未全选
    selectAll.value = val.length > 0 && new_selected_list.length === val.length;
    indeterminate.value = new_selected_list.length > 0 && new_selected_list.length < val.length;
});
// 子组件中有全选和反选的判断，如果加上了checkboxGroup，子组件的全选和反选就无法生效，所以改为数组通过true和false来进行判断
watch(() => form.value.form_value, (new_val) => { 
    if (new_val.length > 0) {
        selected_list.value = new_val.map((item: any) => false)
    } else {
        selected_list.value = [];
    }
}, { immediate: true, deep: true });
//#endregion

const data_check = (object: any, index: number, id: string, com_data: any) => {
    if (props.isPreview) {
        const data = form_error_list.value[index][id];
        const form_value = form.value.form_value[index][id];
        if (isEmpty(data)) {
            return 
        }
        // 判断是否是必填字段,并且没有值
        if (com_data.is_required == '1' && isEmpty(form_value)) {
            // 是否报错显示
            data.common_config.is_error = '1';
            data.common_config.error_text = '此项为必填项';
        } else {
            // 否就清除报错显示
            data.common_config.is_error = '0';
            data.common_config.error_text = '';
            if (object.is_format) {
                if (object.type == 'number') {
                    // 数字组件的校验逻辑
                    number_range_handle(com_data, form_value);
                } else if (object.type == 'checkbox') {
                    // 复选框和复选下拉框的校验逻辑
                    checkbox_range_handle(com_data, form_value);
                } else {
                    // 单行文本的校验逻辑
                    // 对字段进行格式检查
                    get_format_checks_v2(com_data.common_config, form_value);
                }
            }
        } 
    }
};
// 报错显示
const line_error = computed(() => {
    return (index: number) => {
        let text = '';
        for (let i = 0; i < children.value.length; i++) {
            const item = children.value[i];
            if (form_error_list.value[index]) {
                const err_list = form_error_list.value[index][item.id] || {};
                // 如果当前行有错误
                if (err_list && err_list.common_config && err_list.common_config.is_error == '1') {
                    if (err_list.common_config.error_text == '此项为必填项') {
                        text = `请填写「${item.com_data.title}」`;
                    } else {
                        text = `请正确填写「${item.com_data.title}」`;
                    }
                    break;
                }
            }
        }
        return text;
    };
});
//#region 表单详情相关
const drawer_visible = ref(false);
const drawer_index = ref(0);
const drawer_title = computed(() => form.value.title);
// 打开抽屉
const enlarge_click = (index: number) => {
    set_drawer_data(index);
    drawer_index.value = index + 1;
    drawer_visible.value = true;
}
const drawer_data = ref([]);
const set_drawer_data = (index: number) => { 
    const data = cloneDeep(form.value.children);
    data.forEach((item: any) => {
        if (props.isPreview) {
            if (form_error_list.value[index] && !isEmpty(form_error_list.value[index][item.id])) {
                const error = form_error_list.value[index][item.id];
                item.com_data.common_config.is_error = error.common_config.is_error;
                item.com_data.common_config.error_text = error.common_config.error_text;
            }
        } else {
            item.com_data.is_required = '0';
            item.com_data.common_config.is_error = '0';
            item.com_data.common_config.error_text = '';
        }
        if (form.value.form_value[index] && !isEmpty(form.value.form_value[index][item.id])) {
            const value = form.value.form_value[index][item.id];
            item.com_data.form_value = value;
        }
    });
    drawer_data.value = data;
};
const previous_page = (index: number) => {
    enlarge_click(index - 1);
};
const next_page = (index: number) => { 
    enlarge_click(index);
};
// 抽屉点击添加
const drawer_add = () => { 
    form.value.form_value.push(cloneDeep(form_data.value));
    enlarge_click(form.value.form_value.length - 1);
};
// 抽屉点击复制
const drawer_copy = (data: any) => { 
    const new_data = data.reduce((acc: any, item: any) => {
        acc[item.id] = item.com_data.form_value;
        return acc;
    }, {});
    form.value.form_value.push(cloneDeep(new_data));
    enlarge_click(form.value.form_value.length - 1);
};

const drawer_change = (data: any) => {
    const new_data = data.reduce((acc: any, item: any) => {
        acc[item.id] = item.com_data.form_value;
        return acc;
    }, {});
    const index = drawer_index.value - 1;
    form.value.form_value[index] = new_data;
    if (props.isPreview) {
        data.forEach((item: any) => {
            const err_list = form_error_list.value[index];
            if (err_list && err_list[item.id]) {
                err_list[item.id].common_config.is_error = item.com_data.common_config.is_error;
                err_list[item.id].common_config.error_text = item.com_data.common_config.error_text;
            }
        });
    }
};
//#endregion    
</script>

<style lang="scss" scoped>
.table-container {
    padding-bottom: 0.2rem;
    overflow: auto; /* 允许滚动 */
    .table-header {
        position: sticky;
        top: 0;
        z-index: 3;
        .head-label {
            background: #f0f1f4;
            border: 0.1rem solid #e6e8ed;
            border-top-left-radius: 0.3rem;
            width: 7.8rem;
            height: 3.5rem;
        }
        .item-label {
            flex-shrink: 0;
            height: 3.5rem;
            padding: 0.5rem;
            background: #f0f1f4;
            font-size: 1.4rem;
            color: #141E31;
            border: 0.1rem solid #e6e8ed;
            border-left: 0;
        }
    }
    .table-body {
        .table-row .cell-num {
            text-align: center;
            background: #fff;
            border: 0.1rem solid #e6e8ed;
            border-top: 0;
            width: 7.8rem;
            min-height: 4rem;
            line-height: 4rem;
        }
        .table-row .cell {
            flex-shrink: 0;
            padding: 0.5rem;
            min-height: 4rem;
            border: 0.1rem solid #e6e8ed;
            border-left: 0;
            border-top: 0;
        }
        .item-row-error {
            background: #fdeeee;
        }
        .table-row:hover {
            .cell {
                background: #f0f1f4;
            }
            .item-row-error {
                background: #fdeeee;
            }
            .operate {
                display: flex;
            }
        }
        .operate:hover {
            display: flex;
        }
        .operate {
            position: absolute;
            background: #fff;
            left: 0.1rem;
            width: calc(100% - 0.2rem);
            height: calc(100% - 0.2rem);
            top: 0.1rem;
            z-index: 2;
            display: none;
        }
    }
    .table-sticky {
        position: sticky;
        left: 0;
        z-index: 2;
    }
    .row-num {
        font-size: 1.4rem;
    }
}
.selected-checkbox {
    :deep(.el-checkbox) {
        margin-right: 0;
        .el-checkbox__label {
            padding-left: 0;
        }
    }
}
.shrink {
    flex-shrink: 0;
}
.error-icon {
    width: 2rem;
    height: 2rem;
    font-size: 1.6rem;
    line-height: 1.6rem;
    background: #eb5050;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
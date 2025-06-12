<template>
    <el-dialog v-model="dialogVisible" title="显隐规则" width="800px" style="height: 600px" align-center :close-on-click-modal="false" :close-on-press-escape="false" append-to-body draggable @close="cancel"> 
        <div class="content flex-col gap-10 mtb-20">
            <el-dropdown trigger="click" max-height="300px" size="large" placement="bottom-start" @visible-change="input_value1 = ''">
                <el-button class="dialog-add"><icon name="xzdz-tianjiabiaoq" size="14" color="#2a94ff"/><span class="ml-5">显隐规则</span></el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-input v-model="input_value1" class="search-input" placeholder="搜索" :prefix-icon="Search" size="large" />
                        <el-dropdown-item v-for="item in props.optionList.filter((item1: any) => item1.name.includes(input_value1))" :key="item.value" @click="dropdown_click(item.value)">{{ item.name }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <div v-for="(form_item, index) in form" :key="index" class="flex-row gap-10 align-c">
                <span>选择</span>
                <el-select v-model="form_item.value" placeholder="请选择" class="option-class" popper-class="custom-select" clearable @focus="input_value2 = ''" @clear="form_item.is_show = []">
                    <template #header>
                        <el-input v-model="input_value2" class="search-select-input" placeholder="搜索" :prefix-icon="Search" size="large" />
                    </template>
                    <el-option v-for="item in props.optionList.filter((item1: any) => item1.name.includes(input_value2))" :key="item.value" :value="item.value" :label="item.name" />
                </el-select>
                <span>时，显示</span>
                <el-select v-model="form_item.is_show" multiple collapse-tags collapse-tags-tooltip placeholder="请选择" popper-class="custom-select" class="flex-1" clearable :disabled="isEmpty(form_item.value)" @focus="input_value3 = ''">
                    <template #header>
                        <el-input v-model="input_value3" class="search-select-input" placeholder="搜索" :prefix-icon="Search" size="large" />
                    </template>
                    <el-checkbox-group :model-value="form_item.is_show">
                        <el-option v-for="item in show_hidden_operate_list.filter((item1: any) => item1.com_data.title.includes(input_value3) && item1.id !== modelId && item1.is_enable == '1')" :key="item.id" :value="item.id" :label="item.com_data.title">
                            <el-checkbox :value="item.id" :label="item.com_data.title">{{ item.com_data.title }}</el-checkbox>
                        </el-option>
                    </el-checkbox-group>
                </el-select>
                <icon name="delete-o" size="18" color="6" @click="remove(index)"/>
            </div>
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
import { Search } from '@element-plus/icons-vue'
import { isEmpty, cloneDeep } from "lodash";
import SubformWidth from '../subform-handle/subform-width.vue';
// 从组件的顶层获取数据，避免多层组件传值导致数据遗漏和多余代码
const diy_data: any = toRef(inject('diy_data', []));

const props = defineProps({
    // 配置类型，layout：表单布局，style：表单样式
    optionList: {
        type: Array<any>,
        default: [],
    },
    showList: {
        type: Array<any>,
        default: [],
    },
    modelId: {
        type: String,
        default: '',
    },
    isSubform: {
        type: Boolean,
        default: false,
    },
    subformData: {
        type: Array<any>,
        default: () => ([]),
    }
});
//#region 规则显示逻辑处理
type show_hidden = {
    value: string;
    is_show: string[];
}
const form = ref<show_hidden[]>([]);
const subformData = computed(() => props.subformData);
watch(() => subformData.value, (newValue) => { 
    console.log(newValue);
});
const show_hidden_operate_list = computed(() => props.isSubform ? subformData.value : diy_data.value);
// 搜索内容
const input_value1 = ref('');
const input_value2 = ref('');
const input_value3 = ref('');
// 弹出框显示逻辑
const dialogVisible = defineModel('visible', { type: Boolean, default: false });
watchEffect(() => {
    if (dialogVisible.value) {
        if (props.showList.length === 0) {
            form.value = [{ value:'', is_show:[] }];
        } else {
            form.value = cloneDeep(props.showList);
        }
    }
})
//#endregion
//#region 内部处理逻辑
const dropdown_click = (value: string) => {
    form.value.push({ value, is_show: [] });
};
const remove = (index: number) => {
    form.value.splice(index, 1);
};
//#endregion
//#region 弹窗逻辑处理
const data_handle = () => {
    const data = form.value.filter(item => !isEmpty(item.value) && !isEmpty(item.is_show));
    if (data.length == 0) {
        form.value = [];
    } else {
        form.value = data;
    }
}
const cancel = () => {
    form.value = props.showList;
    dialogVisible.value = false;
};
const emit = defineEmits(['submit']);
type hiddenData = {
    id: string;
    list: string[];
};
const submit = () => {
    // 取出所有设置显隐规则的组件
    const list = show_hidden_operate_list.value.filter((item: any) => item.id !== props.modelId && ['single-text', 'select', 'radio-btns'].includes(item.key) && ['select', 'radio-btns'].includes(item.com_data.type) && item.com_data.show_hidden_list.length > 0);
    // 取出其他的显隐规则逻辑
    let old_hidden_list: hiddenData[] = [];
    if (list.length > 0) {
        list.forEach((item: any) => {
            const show_list = item.com_data.show_hidden_list.reduce((acc: string[], current: { is_show: string[] }) => {
                return acc.concat(current.is_show);
            }, []);
            old_hidden_list.push({ id: item.id, list: show_list });
        });
    }
    // 取出新的显隐规则逻辑处理数组
    const new_hidden_list = form.value.reduce((acc: string[], current: { is_show: string[] }) => {
        return acc.concat(current.is_show);
    }, []);
    // 遍历新的显隐规则逻辑判断历史的是否有选中当前这个组件的
    // 提前构建 id 到 list 的映射，提高查找效率
    const oldHiddenMap = new Map<string, hiddenData[]>();
    old_hidden_list.forEach((item: { id: string } & hiddenData) => {
        if (!oldHiddenMap.has(item.id)) {
            oldHiddenMap.set(item.id, []);
        }
        oldHiddenMap.get(item.id)!.push(item);
    });
    // 判断是否有逻辑闭环的选择
    const matchedItem = new_hidden_list.findIndex((itemId: string) => {
        const list = oldHiddenMap.get(itemId);
        if (!list) return false;
        return list.some((subItem: hiddenData) => {
            return subItem.list.includes(props.modelId);
        });
    });
    // 逻辑闭环时不可添加
    if (matchedItem !== -1) {
        ElMessage.error('字段显隐规则设计成环');
    } else {
        data_handle();
        emit('submit', form.value);
        dialogVisible.value = false;
    }
}
//#endregion
</script>

<style lang="scss" scoped>
.dialog-add {
    border: 0px;
    background: #fff;
    color: $cr-main;
    font-size: 1.4rem;
    padding-left: 0;
    padding-right: 0;
}
.content {
    height: 44rem;
    overflow: hidden;
    overflow-y: auto;
}
.option-class {
    max-width: 20rem;
}
.search-input, .search-select-input {
    :deep(.el-input__wrapper) {
        box-shadow: none;
        border-radius: 0;
    }
}
.search-input {
    :deep(.el-input__wrapper) {
        border-bottom: 1px solid #ebeef5;
    }
}
</style>
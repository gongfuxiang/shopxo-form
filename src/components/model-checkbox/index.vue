<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style + layout_style">
            <form-title :value="props.value" :style="title_style"></form-title>
            <div class="content w flex-col gap-10">
                <template v-if="form.type == 'checkbox'">
                    <el-checkbox-group v-model="form.form_value" :class="['adaptive-height', { 'vertical-group' : form.arrangement == 'vertical' }]" @change="data_check">
                        <el-checkbox v-for="item in form.option_list" :key="item.value" :value="item.value"><div :style="option_style(item)">{{ item.name }}</div></el-checkbox>
                    </el-checkbox-group>
                    <el-popover v-if="form.is_add_option == '1'" :visible="popover_visible" placement="top-start" trigger='click' effect="light" popper-class="custom-popover" :width="200">
                        <div class="flex-col gap-20">
                            <el-form ref="ruleFormRef" :model="popover_form" :rules="rules" label-width="85" status-icon>
                                <el-form-item label-width="0" prop="popover_option">
                                    <el-input v-model="popover_form.popover_option" placeholder="请填写内容，enter确定" @change="confirm(ruleFormRef)"></el-input>
                                </el-form-item>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="small" text @click="cancle(ruleFormRef)">取消</el-button>
                                    <el-button size="small" type="primary" @click="confirm(ruleFormRef)">确定</el-button>
                                </div>
                            </el-form>
                        </div>
                        <template #reference>
                            <div class="add-option flex-row gap-10 align-c" @click="add_option">
                                <icon name="xzdz-tianjiabiaoq" size="14" color="#2a94ff"/>
                                <span class="size-14 cr-primary">添加选项</span>
                            </div>
                        </template>
                    </el-popover>
                </template>
                <template v-else-if="form.type == 'select-multi'">
                    <div class="flex-col gap-10">
                        <el-select v-model="form.form_value" multiple placeholder="" class="multi-select flex-1 border-focus" popper-class="custom-select" :style="frame_style + style_container" @change="data_check" @visible-change="input_value = ''">
                            <template #header>
                                <el-input v-model="input_value" class="search-select-input" placeholder="搜索(多个关键字用空格隔开)" :prefix-icon="Search" size="large" />
                            </template>
                            <el-checkbox v-model="selectAll" :indeterminate="indeterminate" class="pl-20" @change="handleCheckAllChange">{{ !isEmpty(input_value) ? '搜索结果全选' : '全选' }}</el-checkbox>
                            <el-checkbox-group :model-value="form.form_value">
                                <el-option v-for="item in new_option_list" :key="item.value" :value="item.value" :label="item.name">
                                    <el-checkbox :value="item.value" :label="item.name"><div :style="option_style(item)">{{ item.name }}</div></el-checkbox>
                                </el-option>
                            </el-checkbox-group>
                            <template v-if="form.is_add_option == '1'" #footer>
                                <div v-if="!popover_visible" class="add-option flex-row gap-10 align-c pl-20" @click="add_option">
                                    <icon name="xzdz-tianjiabiaoq" size="14" color="#2a94ff"/>
                                    <span class="size-14 cr-primary">添加选项</span>
                                </div>
                                <div v-else class="flex-col gap-10 align-c jc-sb w h">
                                    <el-form ref="ruleFormRef" :model="popover_form" :rules="rules" class="w h" label-width="0" status-icon>
                                        <el-form-item label-width="0" prop="popover_option" class="mb-0">
                                            <el-input v-model="popover_form.popover_option" placeholder="请填写内容，enter确定" type="small" @change="confirm(ruleFormRef)"></el-input>
                                        </el-form-item>
                                    </el-form>
                                    <div style="text-align: left;">
                                        <el-button size="small" text @click="cancle(ruleFormRef)">取消</el-button>
                                        <el-button size="small" type="primary" @click="confirm(ruleFormRef)">确定</el-button>
                                    </div>
                                </div>
                            </template>
                            <!-- 选中之后的效果 -->
                            <template #tag>
                                <template v-if="isEmpty(form.form_value)">
                                    <div class="select-tag" :style="common_styles">{{ form.placeholder }}</div>
                                </template>
                                <template v-else>
                                    <template v-if="form.is_multicolour == '1'">
                                        <div v-for="item in form.option_list.filter((item1: any) => form.form_value.includes(item1.value))" :key="item.value" :style="option_style(item) + 'white-space: nowrap;'">{{ item.name }}</div>
                                    </template>
                                    <template v-else> 
                                        <div class="text-line-1" :style="common_styles">{{ selected_names }}</div>
                                    </template>
                                </template>
                            </template>
                        </el-select>
                    </div>
                </template>
                <form-error v-if="form.common_config.is_error == '1'" v-model="form.common_config.error_text"></form-error>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { common_styles_computer, get_border_left_right_size, get_format_checks, get_math } from "@/utils";
import { commonStore } from "@/store";
import { isEmpty, cloneDeep } from "lodash";
import { FormInstance, FormRules } from "element-plus/es/components/form";
import { color_change } from "@/utils/common";
import { Search } from '@element-plus/icons-vue'
const common_store = commonStore();
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    isCustom: {
        type: Boolean,
        default: false,
    }
});
const form = computed(() => props.value);

const data_check = () => {
    get_format_checks(form.value, true, 'checkbox');
};
const frame_style = computed(() => common_store.frame_style + `${ props.isCustom ? `max-width:100%;width:calc(100% - ${ get_border_left_right_size(form.value.common_config) }px);` : '' }`);
const layout_style = computed(() => common_store.form_layout?.computer?.flex_direction == 'row' && form.value.type == 'checkbox' ? 'align-items:flex-start;' : '');
const title_style = computed(() => common_store.form_layout?.computer?.flex_direction == 'row' && form.value.type == 'checkbox'? 'margin-top:2px;' : '');
// #region 添加选项相关
type popoverForm = {
    popover_option: string;
}
const popover_form = reactive<popoverForm>({
    popover_option: '',
});
const rules = reactive<FormRules<popoverForm>>({
    popover_option: [
        { required: true, message: '请输入选项名称', trigger: ['change', 'blur'] },
    ],
});
const ruleFormRef = ref<FormInstance>();
const popover_visible = ref(false);
// 点击添加选项
const add_option = () => {
    popover_visible.value = true;
};
// 取消添加选项
const cancle = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    popover_visible.value = false;
};
// 确认添加选项时的操作
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid: any, fields: any) => {
    if (valid) {
        const value = 'option' + get_math();
        form.value.option_list.push({
            name: popover_form.popover_option,
            value: value,
            color: color_change(form.value.option_list.length - 1),
        });
        form.value.form_value.push(value);
        popover_visible.value = false;
    }
  })
}
//#endregion
//#region 多选下拉框全选和反选的处理
// 搜索框筛选内容
const new_option_list = computed(() => {
    if (!isEmpty(input_value.value)) {
        const inputValue = input_value.value.split(' ').filter(item => item !== '');
        return form.value.option_list.filter((item: { value: string }) => inputValue.some(keyword => item.value.includes(keyword)));
    } else {
        return form.value.option_list;
    }
    
});
const selectAll = ref(false);
const input_value = ref('');
const indeterminate = ref(true);
watchEffect(() => {
    if (!isEmpty(input_value.value)) {
        // 判断符合条件的数据中选中多少个
        const count = new_option_list.value.reduce((acc : number, item: { value: string }) => form.value.form_value.includes(item.value) ? acc + 1 : acc, 0);
        const flag = count > 0 && count < new_option_list.value.length;
        selectAll.value = count == new_option_list.value.length;
        indeterminate.value = flag;
    } else {
        const valueSet = new Set(form.value.form_value);
        const flag = valueSet.size > 0 && valueSet.size < form.value.option_list.length;
        selectAll.value = valueSet.size == form.value.option_list.length;
        indeterminate.value = flag;
    }
});
// 全选操作时的处理
const handleCheckAllChange = () => {
    if (!isEmpty(input_value.value)) {
        // 判断有多少个符合筛选条件的数据
        const option_list_value = new_option_list.value.map((item: { value: any }) => item.value);
        form.value.form_value = selectAll.value ? cloneDeep(form.value.form_value).concat(option_list_value) : cloneDeep(form.value.form_value).filter((item: any) => !option_list_value.includes(item))
    } else {
        form.value.form_value = selectAll.value ? form.value.option_list.map((item: { value: any }) => item.value) : []
    }
}
//#endregion
const selected_names = computed(() => {
    const optionList = form.value?.option_list || [];
    const formValue = form.value?.form_value || [];

    const valueSet = new Set(formValue);
    return optionList
    .filter((item: { value: any; name: string }) => valueSet.has(item.value))
    .map((item: { name: string }) => item.name)
    .join(',');
});
// 没有彩色时的公共样式
const common_styles = computed(() => `${ common_store.color_style };padding-left:0rem;padding-right:0rem;`);
const option_style = (val: any) => {
    if (form.value.is_multicolour == '1') {
        return `background:${ val.color };color:${ val.is_outer == '1' ? '#141E31' : '#fff'};border-radius:0.4rem;${ common_store.color_style }`;
    } else {
        return common_styles.value;
    }
}
// 用于样式显示
const style_container = computed(() => common_styles_computer(form.value.common_config));
</script>
<style lang="scss" scoped>
.select-tag {
    color: #a8abb2;
}
.search-input, .search-select-input {
    :deep(.el-input__wrapper) {
        box-shadow: none;
        border-radius: 0;
    }
}
.multi-select {
    :deep(.el-select__wrapper) {
        .el-select__selection {
            flex-wrap: nowrap;
            overflow: hidden;
        }
        .el-select__suffix {
            padding-left: 0.2rem;
        }
    }
}
.add-option {
    cursor: pointer;
}
</style>

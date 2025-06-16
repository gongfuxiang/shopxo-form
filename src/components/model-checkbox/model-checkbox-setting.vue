<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb">标题<component-switch-select v-model="form.type" :option-list="form_type_option.filter(item => (isSubform && item.value == 'select-multi') || !isSubform)" @dropdown_click="dropdown_click"/></div>
                <el-input v-model="form.title" placeholder="请输入标题" @change="title_change"></el-input>
            </div>
        </el-form-item>
        <el-form-item v-if="form.type !== 'checkbox'" label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">提示文字</div>
                <el-input v-model="form.placeholder" placeholder="请输入提示文字" clearable @change="operation_end"></el-input>
            </div>
        </el-form-item>
        <option-config v-model:multicolour="form.is_multicolour" v-model:check-value="form.form_value" :list="form.option_list" :multiple="true" :is-outer="false" @option-change="option_change" @onsort="option_list_change"></option-config>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">选项设置</div>
                <div><el-checkbox v-model="form.is_add_option" label="允许成员填写时添加新选项" true-value="1" false-value="0" /></div>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col w h">
                <div class="new_title mb-10">校验</div>
                <div><el-checkbox v-model="form.is_required" label="必填" true-value="1" false-value="0" /></div>
                <div><el-checkbox v-model="form.is_limit_num" label="限制可选数量" true-value="1" false-value="0" /></div>
                <template v-if="form.is_limit_num == '1'">
                    <div class="flex-row gap-10 w mt-10">
                        <number-input v-model="form.min_num" class="rendering-area" placeholder="不限" @blur="handle_min_max_blur('min_num')"></number-input>
                        <div class="flex-1">~</div>
                        <number-input v-model="form.max_num" class="rendering-area" placeholder="不限" @blur="handle_min_max_blur('max_num')"></number-input>
                    </div>
                </template>
            </div>
        </el-form-item>
        <template v-if="form.type == 'checkbox'">
            <el-form-item label-width="0">
                <div class="flex-col gap-10 w h">
                    <div class="new_title">分布方式</div>
                    <el-radio-group v-model="form.arrangement" class="two-copies-group w h" is-button>
                        <el-radio-button value="horizontal">横向排列</el-radio-button>
                        <el-radio-button value="vertical">纵向排列</el-radio-button>
                    </el-radio-group>
                </div>
            </el-form-item>
        </template>
        <template v-else>
            <border-config class="mb-18" :value="form.common_config" />
        </template>
        <help-config class="mb-18" :value="form.common_config" />
        <template v-if="isSubform">
            <subform-width v-model="form.com_width"></subform-width>
        </template>
    </el-form>
</template>
<script setup lang="ts">
import { parse_and_format } from '@/utils';
import { cloneDeep, isEmpty } from 'lodash'
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    modelId: {
        type: String,
        default: '',
    },
    isSubform: {
        type: Boolean,
        default: false,
    },
});
const form = ref(props.value);// 判断配置项是否有误
//#region 标题更新时的修改
const old_title = ref(cloneDeep(form.value.title));
const title_change = () => {
    if (isEmpty(form.value.title)) {
        form.value.title = old_title.value;
    }
};
//#endregion
// 切换组件选项
const form_type_option = [
    { name: '多选按钮组', value: 'checkbox' },
    { name: '下拉复选框', value: 'select-multi' },
];
const dropdown_click = (val: string) => {
    form.value.type = val;
    // 切换内容的时候默认值清空
    form.value.form_value = [];
}
// 判断配置项是否有误
const option_change = (val: boolean) => {
    if (!val) {
        form.value.common_config.is_error = '1';
        form.value.common_config.error_text = '此项配置有误，请检查字段属性';
    } else {
        form.value.common_config.is_error = '0';
        form.value.common_config.error_text = '';
    }
};
const option_list_change = (val: boolean) => {
    form.value.option_list = val;
};
/**
 * 处理最小值和最大值输入框失焦事件
 * 该函数旨在确保最小值和最大值符合规定的十进制数，并防止最小值大于最大值
 * 当最小值大于最大值时，将两个值设置为相等
 * 
 * @param {string} triggerField - 触发该函数的字段，只能是 'min_num' 或 'max_num'
 */
 const handle_min_max_blur = (triggerField: 'min_num' | 'max_num') => {
    // 从表单中提取当前的最小值、最大值和小数位数
    const { min_num, max_num } = form.value;

    // 解析并格式化最小值和最大值
    const min = parse_and_format(min_num, 0);
    const max = parse_and_format(max_num, 0);

    // 确保最小值不大于最大值，如果违反，则将两个值设置为相等
    if (min !== null && max !== null && min > max) {
        if (triggerField === 'min_num') {
            form.value.max_num = form.value.min_num;
        } else {
            form.value.min_num = form.value.max_num;
        }
    }
};

const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
</script>

<style scoped lang="scss"> 
</style>

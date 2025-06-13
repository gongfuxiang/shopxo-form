<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb w h">标题
                    <component-switch-select v-model="form.type" :option-list="form_type_option.filter(item => (isSubform && item.value !== 'radio-btns') || !isSubform)" @dropdown_click="dropdown_click"/>
                </div>
                <el-input v-model="form.title" placeholder="请输入标题" clearable @change="operation_end"></el-input>
            </div>
        </el-form-item>
        <el-form-item v-if="form.type !== 'radio-btns'" label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">提示文字</div>
                <el-input v-model="form.placeholder" placeholder="请输入提示文字" clearable @change="operation_end"></el-input>
            </div>
        </el-form-item>
        <template v-if="form.type == 'single-text'">
            <el-form-item label-width="0">
                <div class="flex-col gap-10 w h">
                    <div class="new_title">格式</div>
                    <el-select v-model="form.format" value-key="id" filterable placeholder="请选择输入格式" size="default" class="flex-1" @change="operation_end">
                        <el-option v-for="item in format_option" :key="item.value" :label="item.name" :value="item.value" />
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item label-width="0">
                <div class="flex-col gap-10 w h">
                    <div class="new_title">默认值</div>
                    <el-input v-model="form.form_value" placeholder="请输入默认值" clearable @change="operation_end"></el-input>
                </div>
            </el-form-item>
        </template>
        <template v-else>
            <option-config v-model:multicolour="form.is_multicolour" v-model:radio-value="form.form_value" :list="form.option_list" :multiple="false" @option-change="option_change" @onsort="option_list_change"></option-config>
        </template>
        <el-form-item label-width="0">
            <div class="flex-col w h">
                <div class="new_title mb-10">校验</div>
                <div><el-checkbox v-model="form.is_required" label="必填" true-value="1" false-value="0" /></div>
                <template v-if="form.type == 'single-text'">
                    <div><el-checkbox v-model="form.is_limit_num" label="限制字数" true-value="1" false-value="0" /></div>
                    <template v-if="form.is_limit_num == '1'">
                        <div class="flex-row gap-10 w mb-10">
                            <number-input v-model="form.min_num" class="rendering-area" placeholder="不限" @blur="handle_min_max_blur('min_num')"></number-input>
                            <div class="flex-1">~</div>
                            <number-input v-model="form.max_num" class="rendering-area" placeholder="不限" @blur="handle_min_max_blur('max_num')"></number-input>
                        </div>
                    </template>
                    <desensitization v-model:value="form.desensitization_value" v-model:show="form.is_desensitization"></desensitization>
                </template>
            </div>
        </el-form-item>
        <template v-if="form.type !== 'single-text'">
            <el-form-item label-width="0">
                <div class="flex-col gap-10 w h">
                    <div class="new_title flex-row align-c gap-10">显隐规则<tooltip v-if="isSubform" content="子表单里的显隐规则只在设置默认值和实际使用时生效"></tooltip></div>
                    <el-button v-if="form.show_hidden_list.length == 0" @click="open_dialog">设置</el-button>
                    <div v-if="form.show_hidden_list.length > 0" class="flex-row jc-sb align-c gap-10 layout-style pr-10" @click="open_dialog">
                        <div class="title">已设置显隐规则</div>
                        <icon name="edit" size="18"/>
                    </div>
                </div>
            </el-form-item>
        </template>
        <template v-if="form.type !== 'radio-btns'">
            <border-config class="mb-18" :value="form.common_config" />
        </template>
        <template v-else>
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
        <help-config class="mb-18" :value="form.common_config" />
        <template v-if="isSubform">
            <subform-width v-model="form.com_width"></subform-width>
        </template>
        <show-hidden v-model:visible="dialog_visible" :option-list="form.option_list" :show-list="form.show_hidden_list" :is-subform="isSubform" :subform-data="subformList" :model-id="modelId" @submit="submit"></show-hidden>
    </el-form>
</template>
<script setup lang="ts">
import { parse_and_format } from '@/utils';

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
    subformList: {
        type: Array,
        default: () => ([]),
    }
});
const form = ref(props.value);
// 切换组件选项
const form_type_option = [
    { name: '单行文本', value: 'single-text' },
    { name: '下拉框', value: 'select' },
    { name: '单选按钮组', value: 'radio-btns' },
];
// 校验类型选项
const format_option = [
    { name: '无', value: 'none' },
    { name: '手机号码', value: 'phone-number' },
    { name: '电话号码', value: 'telephone-number' },
    { name: '邮政编码', value: 'postal-code' },
    { name: '身份证号码', value: 'id-no' },
    { name: '邮箱', value: 'email' },
];
//#region 下拉框显示
const dropdown_click = (val: string) => {
    form.value.type = val;
    // 切换内容的时候默认值清空
    form.value.form_value = '';
    // 切换内容的时候清空校验类型
    form.value.is_desensitization = '0';
    form.value.desensitization_value = [];
}
//#endregion
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
const option_list_change = (val: boolean) => {
    form.value.option_list = val;
};
const dialog_visible = ref(false);
const open_dialog = () => {
    dialog_visible.value = true;
};
const submit = (val: any) => {
    form.value.show_hidden_list = val;
};
const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
</script>

<style scoped lang="scss"> 
.select-type {
    width: 9rem;
    height: 2rem;
}
:deep(.el-select.el-select--small.select-type) {
    .el-select__wrapper {
        box-shadow: none !important;
        font-size: 1rem;
        min-height: 2rem;
        background: #F6F6F6;
        border-radius: 2px;
    }
    .el-select-dropdown__item {
        padding: 0 1rem !important;
        font-size: 1.2rem;
        // color: #333333;
    }
    .el-select__selected-item.el-select__placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>

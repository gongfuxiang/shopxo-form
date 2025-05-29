<template>
    <div><el-checkbox v-model="isDesensitization" label="数据脱敏" true-value="1" false-value="0" @change="desensitization_click"/></div>
    <template v-if="isDesensitization == '1' && !isEmpty(form_value)">
        <div class="flex-col gap-10">
            <el-button class="w h" @click="desensitization_click">配置脱敏规则</el-button>
            <div class="w h"><el-button class="w h" disabled><span class="select-name">{{ list.length > 0 ? list[0].name : '' }}</span><span class="select-desc">-{{ list.length > 0 ? list[0].desc : '' }}</span></el-button></div>
        </div>
    </template>
    <el-dialog v-model="dialogVisible" title="脱敏规则" width="600px" style="height: 330px" align-center :close-on-click-modal="false" :close-on-press-escape="false" append-to-body draggable @close="cancel"> 
        <div class="content flex-col gap-20 mtb-20">
            <div class="flex-col gap-10">
                <div class="new_title">脱敏规则</div>
                <el-select ref="selectRef" v-model="dialog_value" multiple :multiple-limit="1" filterable placeholder="" class="flex-1">
                    <el-option v-for="item in desensitization_options" :key="item.value" :value="item.value" class="flex-row align-c select-option" @click="select_click(item.value)"><span class="select-name">{{ item.name }}</span><span class="select-desc">-{{ item.desc }}</span></el-option>
                    <template #tag>
                        <div v-for="item in desensitization_options.filter((item1: any) => dialog_value.includes(item1.value))" :key="item.value" class="ml-10"><span class="select-name">{{ item.name }}</span><span class="select-desc">-{{ item.desc }}</span></div>
                    </template>
                </el-select>
            </div>
            <div class="flex-col gap-10">
                <div class="new_title">规则测试</div>
                <div class="desc">输入内容，测试当前脱敏规则效果</div>
                <div class="flex-row gap-20">
                    <template v-if="!is_set_desensitization">
                        <el-input v-model="input_value" :disabled="is_set_desensitization" placeholder="请输入测试内容" />
                    </template>
                    <template v-else>
                        <el-input v-model="desensitization_value" :disabled="is_set_desensitization" placeholder="请输入测试内容" />
                    </template>
                    <el-button type="primary" :disabled="isEmpty(input_value)" plain @click="test_click">{{ !is_set_desensitization ? '脱敏' : '解除脱敏' }}</el-button>
                </div>
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
import { get_desensitization, isEmpty } from "@/utils";
import { desensitization_options } from "@/utils/common";
import type { ElSelect } from "element-plus";
import { cloneDeep } from 'lodash';
// 弹出框中的配置项
const dialog_value = ref<string[]>([]);
// 是否打开脱敏
const isDesensitization = defineModel('show', { type: String, default: '0' });
// 脱敏内容的值
const form_value = defineModel('value', { type: Array, default: ['all'] });

const list = computed(() => desensitization_options.filter((item1: any) => form_value.value == item1.value));
//#region 下拉框处理操作
// 关闭下拉框
const selectRef = ref<InstanceType<typeof ElSelect> | null>(null);
// 单选选择框为了兼容颜色设置，清空老数据并赋值新数据
const select_click = (val: any) => {
    if (!dialog_value.value.includes(val)) {
        dialog_value.value = [];
        dialog_value.value.push(val);
        desensitization_clear();
    }
    // 点击之后关闭下拉框的弹出框
    if (selectRef.value) {
        selectRef.value.blur();
    }
}
//#endregion
const dialogVisible = ref(false);
const desensitization_click = () => {
    if (isDesensitization.value == '1') {
        if (!isEmpty(form_value.value)) {
            dialog_value.value = cloneDeep(form_value.value) as string[];
        } else {
            dialog_value.value = ['all'];
        }
        dialogVisible.value = true;
    } else {
        // 关闭的时候清空选中的类型
        form_value.value = [];
    }
}
//#region 规则校验逻辑
const is_set_desensitization = ref(false);
const input_value = ref('');
const desensitization_value = ref('');
const test_click = () => {
    console.log(dialog_value.value);
    if (!is_set_desensitization.value) {
        desensitization_value.value = get_desensitization(input_value.value, dialog_value.value[0]);
    }
    is_set_desensitization.value = !is_set_desensitization.value;
};
const desensitization_clear = () => {
    // 下拉框数据切换时清空脱敏相关内容
    is_set_desensitization.value = false
    input_value.value = '';
}
//#endregion
//#region 弹窗逻辑处理
const cancel = () => {
    dialog_value.value = [];
    if (isEmpty(form_value.value)) {
        isDesensitization.value = '0';
    }
    desensitization_clear();
    dialogVisible.value = false;
};
const emit = defineEmits(['submit']);
const submit = () => {
    form_value.value = dialog_value.value;
    desensitization_clear();
    dialogVisible.value = false;
}
//#endregion
</script>

<style lang="scss" scoped>
.select-name {
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 1.6rem;
    color: #000;
}
.desc {
    font-size: 1.2rem;
    color: #acb3bd;
}
.select-desc {
    font-size: 1.4rem;
    color: #acb3bd;
}
.select-option {
    cursor: pointer !important;
}
</style>
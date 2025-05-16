<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb">标题<component-switch-select v-model="form.type" :option-list="form_type_option" @dropdown_click="dropdown_click"/></div>
                <el-input v-model="form.title" placeholder="请输入标题" clearable @change="operation_end"></el-input>
            </div>
        </el-form-item>
        <el-form-item v-if="form.type !== 'checkbox'" label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">提示文字</div>
                <el-input v-model="form.placeholder" placeholder="请输入提示文字" clearable @change="operation_end"></el-input>
            </div>
        </el-form-item>
        <option-config v-model:multicolour="form.is_multicolour" v-model:check-value="form.form_value" :list="form.option_list" :multiple="true" :is-outer="false" @option-change="option_change"></option-config>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">选项设置</div>
                <div><el-checkbox v-model="form.add_option" label="允许成员填写时添加新选项" true-value="1" false-value="0" /></div>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">校验</div>
                <div><el-checkbox v-model="form.is_required" label="必填" true-value="1" false-value="0" /></div>
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
            <border-config :value="form.common_config" />
        </template>
        <help-config :value="form.common_config" />
    </el-form>
</template>
<script setup lang="ts">
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    modelId: {
        type: String,
        default: '',
    }
});
const form = ref(props.value);// 判断配置项是否有误
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
const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
</script>

<style scoped lang="scss"> 
</style>

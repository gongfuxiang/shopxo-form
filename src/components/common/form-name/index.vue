<template>
    <div class="form-name-style re">
        <!-- 使用 @input 事件进行输入校验 -->
        <el-input v-model="name" placeholder="请输入标题" class="w-full" @input="validateInput" />
        <div v-if="old_name !== name" class="form-name-button">
            <el-button type="primary" class="name-button" @click="submit">确定</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash';
// 从组件的顶层获取数据，避免多层组件传值导致数据遗漏和多余代码
const diy_data: any = toRef(inject('diy_data', []));

const props = defineProps({
    value: {
        type: String,
        default: () => '',
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
    },
});
// 如果是子表单，获取子表单的数据
const subformData = computed(() => props.subformList);
// 判断当前是否是只子表单
const show_hidden_operate_list = computed(() => props.isSubform ? subformData.value : diy_data.value);

const old_name = ref(cloneDeep(props.value));
watch(() => props.value, () => {
    old_name.value = cloneDeep(props.value);
});
const name = ref(cloneDeep(props.value));
const emit = defineEmits(['name_change']);

// 输入校验函数
const validateInput = () => {
    const regex = /^[a-zA-Z0-9_]*$/;
    if (!regex.test(name.value)) {
        // 若输入不合法，移除非法字符
        name.value = name.value.replace(/[^a-zA-Z0-9_]/g, '');
    }
};

const submit = () => {
    // 取出不是当前数据的内容
    const old_diy_data = show_hidden_operate_list.value.filter((item:any) => item.id !== props.modelId && item.form_name == name.value);
    // 如果有重复的，提示用户
    if (old_diy_data.length > 0) {
        ElMessage.error('FROM名称重复，请重新输入');
        name.value = cloneDeep(old_name.value);
        return;
    } else {
        emit('name_change', name.value);
    }
};
</script>

<style lang="scss" scoped>
.form-name-style {
    display: flex;
    align-items: center;
    :deep(.el-input__wrapper) {
        padding-right: 6.6rem;
    }
}
.form-name-button {
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    :deep(.el-button--primary) {
        height: 2.8rem;
        padding: 0.6rem 1.5rem;
    }
}
</style>
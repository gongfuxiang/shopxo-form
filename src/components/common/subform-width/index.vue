<template>
     <el-form-item label-width="0">
        <div class="flex-col gap-10 w h">
            <div class="new_title">字段宽度</div>
            <el-radio-group v-model="selected_width" class="two-copies-group four-copies-group w h" is-button @change="handle_width_option_change">
                <el-radio-button v-for="(item, index) in option_list" :key="index" :value="item.value">{{ item.name }}</el-radio-button>
            </el-radio-group>
            <template v-if="selected_width == 'custom'">
                <div class="flex-row align-c gap-10">
                    <input-number v-model="custom_width" class="w h" :max="10000000000" placeholder="请输入字段宽度" @change="handle_custom_width_change"></input-number>
                    px
                </div>
            </template>
        </div>
    </el-form-item>
</template>

<script lang="ts" setup> 
const option_list = [
    { name: '1/2', value: '75' },
    { name: '标准', value: '150' },
    { name: '两倍', value: '300' },
    { name: '自定义', value: 'custom' },
]
// 获取外部数据
const width = defineModel({ type: Number, default: 0 });
// 选项发生变化，更新外部数据
const handle_width_option_change = (val: string | number | boolean | undefined) => {
    if (val === 'custom') {
        custom_width.value = width.value;
    } else {
        width.value = Number(val);
    }
};
// 自定义宽度发生变化，更新外部数据
const handle_custom_width_change = () => {
    width.value = custom_width.value;
};

const selected_width = ref<string>('');
const custom_width = ref(0);
watch(() => width.value, (val) => {
    if ([75, 150, 300].includes(val)) {
        selected_width.value = String(val);
    } else {
        selected_width.value = 'custom';
    }
}, { immediate: true });
</script>
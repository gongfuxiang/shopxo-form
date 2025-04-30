<template>
    <div class="flex-col gap-10 w h">
        <div class="new_title flex-row jc-sb align-c">帮助说明<el-switch v-model="form.help_is_show" active-value="1" inactive-value="0" @change="operation_end"></el-switch></div>
        <template v-if="form.help_is_show == '1'">
            <el-input
                v-model="form.help_explain"
                :rows="4"
                type="textarea"
                placeholder="请输入说明文字"
                @change="operation_end"
            />
        </template>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});
const form = ref(props.value);
const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
</script>
<style lang="scss" scoped>
</style>
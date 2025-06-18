<template>
    <el-dropdown trigger="click" popper-class="component-switch" :disabled="new_option_list.length <= 0" max-height="300px" size="large" placement="bottom" @visible-change="visible_change">
        <div class="dialog-add">{{ data_type_map }}
            <template v-if="new_option_list.length > 0">
                <icon :name="is_dropdown_show ? 'arrow-top' : 'arrow-bottom'" size="8" color="#666" />
            </template>
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item v-for="item in new_option_list" :key="item.value" @click="dropdown_click(item.value)">{{ item.name }}</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script lang="ts" setup>
import { commonStore } from "@/store";
const common_store = commonStore();
type Option = {
    name: string,
    value: string,
}
const props = defineProps({
    optionList: {
        type: Array as () => Option[],
        default: () => ([]),
    },
});

const new_option_list = computed(() => props.optionList.filter(item1 => data_type.value !== item1.value));
const data_type = defineModel({ type: String, default: '', required: true})

const data_type_map = computed(() => {
    const data = new Map(props.optionList.map(item => [item.value, item]));
    return data.get(data_type.value)?.name || '单行文本';
});
const emit = defineEmits(['dropdown_click']);
//#region 下拉框显示
const dropdown_click = (val: string) => {
    emit('dropdown_click', val);
}
const is_dropdown_show = ref(false);
const visible_change = (val: boolean) => {
    is_dropdown_show.value = val;
}
//#endregion
</script>

<style lang="scss" scoped>
.dialog-add {
    background: #F6F6F6;
    text-align: center;
    font-size: 1.2rem;
    color: #333;
    height: 2.4rem;
    width: 10rem;
    border: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
}
</style>
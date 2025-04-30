<template>
    <el-form-item label-width="0">
        <div class="flex-col gap-10 w h">
            <div class="new_title">选项</div>
            <drag :data="drag_list" :space-col="20" :is-show-edit="true" @remove="remove" @on-sort="on_sort">
                <template #default="{ row }">
                    <template v-if="multiple">
                        <el-checkbox v-model="row.is_checked">{{ row.name }}</el-checkbox>
                    </template>
                    <template v-else>
                        <el-radio v-model="row.is_checked">{{ row.name }}</el-radio>
                    </template>
                </template>
            </drag>
        </div>
    </el-form-item>
</template>

<script lang="ts" setup> 
import { isEmpty } from 'lodash';

interface Props {
    list: any[];
    multiple: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    imgParams: 'cover',
    multiple: false,
});

const drag_list = ref(props.list);
watchEffect(() => {
    drag_list.value = props.list;
});

const emits = defineEmits(['remove','onsort']);
const on_sort = (item: any) => {
    emits('onsort', item);
};
const remove = (index: number) => {
    emits('remove', index);
};
</script>

<style lang="scss" scoped>
</style>
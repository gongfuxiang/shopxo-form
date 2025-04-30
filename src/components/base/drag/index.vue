<template>
    <VueDraggable v-model="from" :animation="500" target=".sort-target" handle=".icon-drag" :scroll="true" :on-sort="on_sort">
        <TransitionGroup type="transition" tag="ul" name="fade" class="sort-target flex-col gap-x-20">
            <li v-for="(item, index) in from" :key="index" class="flex gap-y-16 re">
                <slot :row="item" :index="index" />
                <icon name="drag" size="16" class="cursor-move" />
                <div class="c-pointer do-not-trigger" @click.stop="remove(index)">
                    <icon name="delete-o" size="18" color="6" />
                </div>
            </li>
        </TransitionGroup>
    </VueDraggable>
</template>

<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus';
const emits = defineEmits(['click', 'remove', 'edit', 'onSort', 'replace', 'copy']);

interface Props {
    data: any; // 拖拽列表数据
    modelType?: string;
    modelIndex?: number;
    multipleIcons?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    modelType: 'outer',
    modelIndex: 0,
    multipleIcons: false,
});
const className = ref('');
watch(
    () => props.data,
    () => {
        from.value = props.data;
    }
);
const from = ref(props.data);

const on_click = (item: any, index: number) => {
    emits('click', item, index);
};

// 删除
const remove = (index: number) => {
    emits('remove', index);
};
// 拖拽更新之后用户更新数据
const on_sort = () => {
    emits('onSort', from.value);
};
</script>
<style lang="scss" scoped>
.card-background {
    background: #fff;
    padding-left: 1.6rem;
    padding-right: 2rem;
    border-radius: 4px;
}

.cursor-move {
    color: #ddd;
    cursor: move;
}
.remove-icon {
    display: flex;
    background: #fff;
    border-radius: 100%;
    line-height: 1.8rem;
}
.nav-index-select {
    box-shadow: 0rem 0 0rem 0.1rem #409eff;
    /* border: 1px solid #409eff; */
}
.multiple-icon-class {
    padding: 0.5rem 1rem;
    background: #f7f7f7;
    border-bottom-left-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}
.multiple-icon {
    display: flex;
    border-radius: 100%;
    line-height: 1.8rem;
}
</style>

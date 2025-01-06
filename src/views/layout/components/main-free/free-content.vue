<template>
    <div v-for="(item, index) in diy_data" :key="item.id" class="item mains-content" :class="{ active: item.show_tabs == '1' }" @click.stop="on_choose(index, item)">
        <div v-if="item.show_tabs == '1'" class="oprate">
            <div class="icon" @click="del(index)">
                <icon name="del" size="10"></icon>
            </div>
            <span class="divider"></span>
            <div class="icon" @click="copy(index, item)">
                <icon name="copy" size="10"></icon>
            </div>
        </div>
        <div>
            <!-- 单行文本 -->
            <template v-if="item.key == 'single-text'">
                <model-input :value="item.data"></model-input>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
const diy_data = defineModel({ type: Array, default: <any[]>[] });

const emits = defineEmits(['on_choose', 'del', 'copy', 'moveUp', 'moveDown']);
// 选中时候的效果
const on_choose = (index: number, item: any) => {
    emits('on_choose', index, item);
};
// 删除
const del = (index: number) => {
    emits('del', index);
};
// 复制
const copy = (index: number, item: any) => {
    emits('copy', index, item);
};
</script>

<style scoped lang="scss">
.mains-content {
    position: relative;
    padding: 1.8rem 2rem;
    cursor: all-scroll;
    &.active {
        background: #f5fbff;
        border-radius: 12px;
    }
    .oprate {
        position: absolute;
        right: 2rem;
        top: 0.8rem;
        display: flex;
        align-items: center;
        background-color: #fff;
        border-radius: 15px;
        color: $cr-primary;
        .icon {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            padding: 0.6rem 1.2rem;
        }
        .divider {
            width: 1px;
            height: 1.2rem;
            background-color: #e4e7ec;
        }
    }
}
</style>

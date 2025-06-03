<template>
    <div v-if="typeof index === 'number' && !isNaN(index)" class="acticons">
        <div class="plug-in-right" chosenClass="close">
            <el-tooltip effect="dark" :show-after="200" :hide-after="200" content="删除组件" placement="right">
                <el-icon :class="`iconfont ${ is_enable == '1' ? 'icon-eye' : 'icon-eye-close'}`" @click.stop="set_enable(index)" />
            </el-tooltip>
            <el-tooltip effect="dark" :show-after="200" :hide-after="200" content="删除组件" placement="right">
                <el-icon class="iconfont icon-del" @click.stop="del(index)" />
            </el-tooltip>
            <el-tooltip effect="dark" :show-after="200" :hide-after="200" content="复制组件" placement="right">
                <el-icon class="iconfont icon-copy" @click.stop="copy(index)" />
            </el-tooltip>
        </div>
    </div>
</template>
<script setup lang="ts">
const index = defineModel('index', { type: Number , default: null });
const dataLength = defineModel('dataLength', { type: Number , default: 0 });
const is_enable = defineModel('is_enable', { type: String , default: '1' });
const emits = defineEmits(['del', 'copy', 'set_enable' ]);
// 删除
const del = (index: number) => {
    emits('del', index)
}
//复制组件
const copy = (index: number) => {
    emits('copy', index)
}
const set_enable = (index: number) => {
    emits('set_enable', index)
}
</script>

<style scoped lang="scss">
.acticons {
    position: absolute;
    left: 50%;
    margin-left: 40rem;
    top: 50%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    z-index: 1;
    transform: translate(-50%, -50%);
}
.plug-in-right {
    cursor: default;
    background: $cr-main;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem 1.2rem;
    color: #fff;
    border-radius: 0.4rem;
    z-index: 2;
    & > i {
        cursor: pointer;
    }
    & > i.disabled {
        color: #5db2ff;
        cursor: not-allowed;
    }
    & .icon-arrow-top,
    & .icon-arrow-bottom {
        height: 0.9rem;
    }
}
</style>
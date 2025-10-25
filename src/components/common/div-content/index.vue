<template>
    <template v-if="diy_data.length > 0">
        <div v-for="(item, index) in diy_data" :key="item.id" :class="['item', { 'active': item.show_tabs == '1', 'required-error': item.com_data.common_config.is_error == '1' }]" @click.stop="on_choose(index, item.show_tabs)">
            <div v-if="item.show_tabs == '1'" class="oprate">
                <div class="icon" @click.stop="set_enable(index)">
                    <icon :name="`${item.is_enable == '1' ? 'eye' : 'eye-close'}`" size="14"/>
                </div>
                <span class="divider"></span>
                <div class="icon" @click.stop="on_del(index)">
                    <icon name="del" size="14"></icon>
                </div>
                <span class="divider"></span>
                <div class="icon" @click.stop="on_copy(index)">
                    <icon name="copy" size="14"></icon>
                </div>
            </div>
            <div class="w h plug-in-disable" :class="{ 'plug-in-close': item.is_enable != '1' }">
                <div class="main-content">
                    <component-show :value="item"></component-show>
                </div>
            </div>
        </div>
    </template>
    <template v-else>
        <div class="w h flex-col align-c jc-c gap-15 no-data-position">
            <img class="img radius-xs" :width="140" :height="131" :src="no_data_image" />
            <span class="no-data-tips">从左侧拖拽或点击来创建表单</span>
        </div>
    </template>
</template>
<script lang="ts" setup>
import { commonStore } from "@/store";
const common_store = commonStore();
const no_data_image = ref(common_store.common.config.attachment_host + `/static/form_input/images/no-data.png`);
interface Props {
    diyData: any[];
}
const props = withDefaults(defineProps<Props>(), {
    diyData: () => [],
});
const diy_data = ref(props.diyData);
watch(() => props.diyData, (val) => {
    diy_data.value = val;
},{ immediate: true, deep: true });

const emits = defineEmits(['on_choose', 'del', 'copy']);
// 是否启用
const set_enable = (index: number) => {
    const old_data = get_diy_index_data(index);
    old_data.is_enable = old_data.is_enable == '1' ? '0' : '1';
};

// 选中时候的效果
const on_choose = (index: number, show_tabs: string) => {
    // 设置对应的位置为显示
    emits('on_choose', index, show_tabs);
};

// 复制
const on_copy = (index: number) => {
    emits('copy', index);
};
// 删除
const on_del = (index: number) => {
    emits('del', index);
};
// 获取当前传递过来的index对应的diy_data中的数据
const get_diy_index_data = (index: number) => {
    return (<arrayIndex>diy_data.value)[index.toString()];
};
</script>
<style scoped lang="scss">
.drag-container {
    max-height: calc(100vh - 7rem);
    .drag-content {
        min-height: 20rem;
        max-width: 100rem;
        background-color: #fff;
        margin: 0 auto;
        .item {
            position: relative;
            cursor: all-scroll;
            &.active {
                position: relative;
                z-index: 1;
                box-sizing: border-box;
            }
            &.active::before {
                content: '';
                width: calc(100% + 0.4rem);
                height: 100%;
                position: absolute;
                top: 0;
                left: -0.2rem;
                border: 0.2rem solid $cr-main;
                z-index: 5;
            }
            .oprate {
                position: absolute;
                right: 2rem;
                top: 0.8rem;
                display: flex;
                align-items: center;
                background-color:#f5fbff;
                border-radius: 15px;
                color: $cr-primary;
                z-index: 5;
                .icon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    padding: 0.3rem 0.8rem;
                }
                .divider {
                    width: 1px;
                    height: 1.2rem;
                    background-color: #e4e7ec;
                }
            }
            .main-content {
                padding: 1.8rem 2rem;
            }
            .plug-in-content::before {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: transparent;
                z-index: 2;
            }
        }
    }
    .drag-seat {
        display: inherit;
    }
    .drag-hide {
        display: none;
    }
}
.no-data-tips {
    font-weight: 400;
    font-size: 1.2rem;
    color: #999999;
    line-height: 1.7rem;
    font-style: normal;
}
.no-data-position {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
}
</style>

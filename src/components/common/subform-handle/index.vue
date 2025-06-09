<template>
    <div class="flex-col">
        <div class="flex-row align-c gap-10">
            <el-button class="custom-button size-14 mb-18"><icon name="xzdz-tianjiabiaoq" size="14" color="f"></icon>添加新行</el-button>
        </div>
        <div class="subform oh flex-row">
            <div class="row-header flex-col">
                <div class="head-label"></div>
                <template v-if="form.form_value.length > 0">
                    <div v-for="(item, index) in form.form_value" :key="index" class="flex-1 flex-row align-c jc-c">
                        <div class="row-num">{{ index + 1 }}</div>
                        <div class="operate">
                            
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="flex-1">
                        <div class="row-num">1</div>
                    </div>
                </template>
            </div>
            <div class="flex-1 scroll-area flex-row">
                <div class="flex-row">
                    <div v-for="item in form.children" :key="item.id" class="subform-item re w h" :style="`width: ${ item.com_data.com_width }px;`">
                        <div class="flex-col jc-c w h">
                            <!-- 头部操作逻辑 -->
                            <div class="item-label flex-row align-c">
                                <span v-if="item.com_data.is_required == '1'" class="required">*</span>
                                {{ item.com_data.title }}
                                <tooltip v-if="item.com_data.common_config.help_is_show == '1'" :content="item.com_data.common_config.help_explain" :size="common_store.help_icon_size"></tooltip>
                            </div>
                            <div v-for="(item1, index1) in form.form_value" :key="index1" class="flex-1 item-row rendering-area flex-row align-c jc-c">
                                <subform-rendering v-model="item.com_data" v-model:type="item.key" :value="item1[item.id]"></subform-rendering>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { commonStore } from "@/store";
const common_store = commonStore();
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});
const form = ref(props.value);
watch(() => props.value, (val) => {
    form.value = val;
}, {immediate: true, deep: true});
</script>

<style lang="scss" scoped>
.subform {
    max-width: 100%;
    width: 100%;
    background: #fff;
    overflow: hidden;
    .row-header {
        padding-bottom: 1rem;
        overflow-x: scroll;
        .head-label {
            background: #f0f1f4;
            border: 0.1rem solid #e6e8ed;
            border-top-left-radius: 0.3rem;
            width: 7.8rem;
            height: 3.5rem;
        }
        .row-num {
            text-align: center;
            background: #fff;
            border: 0.1rem solid #e6e8ed;
            border-top: 0;
            width: 7.8rem;
            min-height: 4rem;
            line-height: 4rem;
            position: relative;
        }
        .row-num:last-child {
            border-bottom-left-radius: 0.3rem;
        }
    }
    .subform-item {
        .item-label {
            height: 3.5rem;
            padding: 0.5rem;
            background: #f0f1f4;
            font-size: 1.4rem;
            color: #141E31;
            border: 0.1rem solid #e6e8ed;
            border-left: 0;
        }
        .item-row { 
            padding: 0.5rem;
            min-height: 4rem;
            border: 0.1rem solid #e6e8ed;
            border-left: 0;
            border-top: 0;
        }
    }
    .scroll-area {
        padding-bottom: 1rem;
        overflow-x: scroll;
        .oprate {
            position: absolute;
            right: 0.5rem;
            top: 0.5rem;
            display: flex;
            align-items: center;
            background-color:#f5fbff;
            border-radius: 15px;
            color: $cr-primary;
            z-index: 2;
            .icon {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                padding: 0.3rem 0.6rem;
            }
            .divider {
                width: 1px;
                height: 1.2rem;
                background-color: #e4e7ec;
            }
        }
    }
}
</style>
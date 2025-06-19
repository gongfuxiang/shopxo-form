<template>
    <div ref="el" :class="`rendering-area percent-input-wrapper ${ is_focus ? 'focus-input' : 'blur-input'}`" @click="percent_input_click">
        <div class="percent-input">
            <el-input ref="el_input" v-model="form_value" :style="newStyle" :placeholder="placeholder" @focus="focus_input" @blur="blur_input">
                <template v-if="!isEmpty(moneySign)" #prefix>{{ moneySign }}</template>
                <template #suffix>%</template>
            </el-input>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { formatNumber } from '@/utils/index'
import { isEmpty } from "lodash";
import type ElInput from 'element-plus/es/components/input/src/input.vue'
const props = defineProps({
    isDecimal: {
        type: Boolean,
        default: false,
    },
    decimalNum: {
        type: Number,
        default: 0
    },
    placeholder: {
        type: String,
        default: ''
    },
    isThousandPoint: {
        type: Boolean,
        default: false,
    },
    isPercentage:{
        type: Boolean,
        default: false,
    },
    format: {
        type: String,
        default: 'num'
    },
    isThousandthsSymbol: {
        type: String,
        default: '0'
    },
    moneySign: {
        type: String,
        default: ''
    },
    newStyle: {
        type: String,
        default: ''
    },
});
const form_value = defineModel({ type: String, default: '' });
//#region 获取容器最大宽度
// const el = ref(null)
// const input_width = ref(0)
// useResizeObserver(el, (entries) => {
//     const entry = entries[0]
//     const { width } = entry.contentRect
//     input_width.value = width;
// })
//#endregion
// 点击div的时候, 输入框默认获取焦点
const is_focus = ref(false);
const el_input = ref<InstanceType<typeof ElInput> | null>(null);
const percent_input_click = () => {
    if (el_input.value) {
        is_focus.value = true;
        el_input.value.focus();
    }
}
const focus_input = () => {
    is_focus.value = true;
    // 不为空的时候，获取焦点的时候将千分位的转化为数字避免用户输入的时候出现问题
    if (!isEmpty(form_value.value)) {
        form_value.value = Number(formatNumber(form_value.value, false)).toFixed(props.decimalNum);
    } else {
        form_value.value = '';
    }
}
const emit = defineEmits(['blur'])
const blur_input = () => {
    is_focus.value = false;
    if (!isEmpty(form_value.value)) {
        let all_list = form_value.value.replace(/[^0-9.]/g, '');
        // 去除不是数字和.的值
        let num = Number(formatNumber(all_list, false)).toFixed(props.decimalNum);
        // 为数字并且时千分位的是你
        if (props.format == 'num' && props.isThousandthsSymbol == '1') {
            // 如果有多个.的话，去除多个.
            const parts = all_list.split('.');
            if (parts.length > 2) {
                // 如果有多个小数点，则只保留第一个
                all_list = parts[0] + '.' + parts.slice(1).join('');
            }
            num = formatNumber(Number(formatNumber(all_list, false)).toFixed(props.decimalNum).toString(), true)
        }
        form_value.value = num;
    } else {
        form_value.value = '';
    }
    emit('blur')
}
// 监听内容发生变化时，重新触发方法
watch(() => [props.decimalNum, props.isThousandthsSymbol, props.format], () => {
    blur_input();
}, { deep: true })
//#region 获取百分比时的最大宽度
// const use_input_width = ref(26);
// watchEffect(() => {
//     if (props.isPercentage) {
//         const min_width = 26 + (form_value.value.length * 7);
//         const max_width = input_width.value - 14;
//         if (min_width < max_width) {
//             use_input_width.value = min_width;
//         } else {
//             use_input_width.value = max_width;
//         }
//     }
// })
//#endregion
</script>

<style scoped lang="scss">
.percent-input-wrapper {
    border-radius: 4px;
}
.percent-input {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 4px;
}
.blur-input {
    border:1px solid #E3E3E3;
}
.focus-input {
    border:1px solid #409eff; 
}
</style>
<template>
    <el-tooltip popper-class="custom-tooltip" :effect="props.effect" :show-after="200" :hide-after="200" :content="props.content" :disabled="isEmpty(props.content)" :raw-content="props.rawContent" :placement="placement">
        <icon name="miaosha-hdgz" :size="props.size + ''" color="#999"></icon>
    </el-tooltip>
</template>

<script lang="ts" setup>
import { isEmpty } from 'lodash';
interface TooltipProps {
    content: string;
    rawContent?: boolean;
    size?: number;
    effect?:  'dark' | 'light';
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start';
}

const props = withDefaults(defineProps<TooltipProps>(), {
    rawContent: true,
    placement: 'top',
    size: 12,
    effect: 'light',
});
</script>


<template>
    <el-input v-model="form_value"></el-input>
</template>

<script lang="ts" setup>
const props = defineProps({
    isDecimal: {
        type: Boolean,
        default: false,
    },
    isThousandPoint: {
        type: Boolean,
        default: false,
    },

});
const form_value = defineModel('value', { type: String, default: '' });
</script>
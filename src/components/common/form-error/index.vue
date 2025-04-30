<template>
    <div v-if="!isEmpty(error_title)" class="field-invalid-info">{{ error_title }}</div>
</template>

<script lang="ts" setup>
import { isEmpty } from 'lodash'
const error_title = defineModel({ type: String, default: '此项为必填项', required: true})
</script>

<style lang="scss" scoped>
.field-invalid-info {
    color: #FF5353;
    font-size: 1.2rem;
    line-height: 2rem;
}
</style>
<template>
    <div class="label flex-row gap-10 align-c" :style="common_store.title_style">
        <div class="flex-row"><span class="text-line-1">{{ form.title }}</span><span v-if="form.is_required == '1'" class="required">*</span></div>
        <tooltip v-if="form.common_config.help_is_show == '1'" :content="form.common_config.help_explain" :size="common_store.help_icon_size"></tooltip>
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
const form = computed(() => props.value);
</script>

<style lang="scss" scoped>
</style>
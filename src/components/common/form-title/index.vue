<template>
    <div v-if="is_show_title" class="label flex-row gap-10 align-c oh" :style="common_store.title_style + `${ isSubform ? ';width: 100%;' : '' }`">
        <div class="flex-row"><span class="flex-row flex-warp">{{ form.title }}</span><span v-if="form.is_required == '1'" class="required">*</span></div>
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
    isSubform: {
        type: Boolean,
        default: false,
    },
});
const form = computed(() => props.value);

const is_show_title = computed(() => {
    if (props.isSubform) {
        return true;
    } else {
        const data = common_store.form_layout?.computer;
        if (data.flex_direction == 'row' && data.filed_title_width == 0) {
            return false
        } else {
            return true
        }
    }
})
</script>

<style lang="scss" scoped>
</style>
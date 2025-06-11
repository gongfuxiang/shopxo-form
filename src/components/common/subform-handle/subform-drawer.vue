<template>
    <el-drawer v-model="drawer_visible" class="drawer-class" :close-on-press-escape="false" destroy-on-close :show-close="false" @close="drawer_visible = false">
        <template #header="{ close }">
            <div class="flex-row align-c jc-sb">
                <span>{{ title }}</span>
                <div class="flex-row align-c gap-20">
                    <div class="flex-row align-c gap-10 size-14">
                        <icon name="arrow-left" size="12" :color="size == 1 ? 'd' : '6'" @click="previous_page(size - 1)"></icon>
                        <span class="flex-row align-c">{{ size }}/{{ total }}</span>
                        <icon name="arrow-right" size="12" :color="size == total ? 'd' : '6'" @click="next_page(size)"></icon>
                    </div>
                    <el-tooltip effect="dark" :show-after="200" :hide-after="200" content="收起" placement="top">
                        <icon name="contract" size="14" color="6" class="contract" @click="close"></icon>
                    </el-tooltip>
                </div>
            </div>
        </template>
        <div v-loading="loading" class="content w h">
            <div class="main">
                <div v-for="(item, index) in form_data" :key="index" :class="['component-style', { 'required-error': item.com_data.common_config.is_error == '1' }]">
                    <component-show :value="item"></component-show>
                </div>
            </div>
            <div class="footer flex-row align-c jc-e">
                <el-button @click="add">新增</el-button>
                <el-button @click="copy">复制</el-button>
                <el-button type="primary" @click="drawer_visible = false">完成</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script lang="ts" setup>
const title = defineModel('title', { type: String, default: '' });
const drawer_visible = defineModel('visible', { type: Boolean, default: false });
const total = defineModel('total', { type: Number, default: 1 });
const size = defineModel('size', { type: Number, default: 1 });
const form_data = defineModel('form_data', { type: Array<any>, default: () => [] });
const emit = defineEmits(['add', 'copy', 'previousPage', 'nextPage', 'change' ]);
const previous_page = (index: number) => {
    if (index >= 1) {
        emit('previousPage', index);
        loading_handle();
    }
};
const next_page = (index: number) => {
    if (index < total.value) {
        emit('nextPage', index);
        loading_handle();
    }
};
const loading = ref(false);
const add = () => {
    emit('add');
    loading_handle();
};
const copy = () => {
    emit('copy', form_data.value);
    loading_handle();
};
const loading_handle = () => {
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
    }, 500);
};
watch(() => form_data.value, () => {
    emit('change', form_data.value);
}, { deep: true });
</script>

<style lang="scss" scoped>
.main {
    height: calc(100% - 5.5rem);
    overflow-y: auto;
}
.footer { 
    padding: 1rem 1.6rem;
    border-top: 1px dashed #ebecee;
}
.component-style {
    margin: 0.5rem;
    padding: 1.8rem 1.6rem;
    :deep(.rendering-area .content) {
        pointer-events: auto;
    }
}
.contract:hover {
    color: $cr-main;
}
</style>
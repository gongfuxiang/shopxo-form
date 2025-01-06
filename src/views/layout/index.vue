<template>
    <div class="layout">
        <navbar v-model="form.model" />
        <div class="content flex-1 flex-row">
            <mains></mains>
            <settings></settings>
        </div>
    </div>
</template>

<script setup lang="ts">
interface diy_data_item {
    id: string;
    model: {
        logo: string;
        name: string;
        is_enable: string;
        describe: string;
    };
    tabs_data: Array<any>;
    diy_data: Array<any>;
}
const form = ref<diy_data_item>({
    id: '',
    model: {
        logo: '',
        name: '112233',
        is_enable: '1',
        describe: '',
    },
    tabs_data: [],
    diy_data: [],
});
</script>

<style scoped lang="scss">
.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f8f8f8;
    // 拖拽禁止选中
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
}
</style>

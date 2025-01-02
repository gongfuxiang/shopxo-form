<script setup lang="ts">
defineProps<{ msg: string }>();
</script>

<template>
    <div class="flex-col jc-c align-c v-h">
        <div class="flex-row">
            <a href="https://vuejs.org/" target="_blank">
                <img src="@/assets/vue.svg" class="logo vue" alt="Vue logo" />
            </a>
        </div>
        <h1>{{ msg }}</h1>
        <div>
            <el-button type="primary">Primary</el-button>
            <el-button type="success">Success</el-button>
            <el-button type="info">Info</el-button>
            <el-button type="warning">Warning</el-button>
            <el-button type="danger">Danger</el-button>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>

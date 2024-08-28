<template>
    <div>
        <DataTableComponent :buildings1="store.buildings" />
    </div>
</template>

<script setup>
import { useBuildingsStore } from '~/store/buildings'

const store = useBuildingsStore()
store.loadData()

</script>
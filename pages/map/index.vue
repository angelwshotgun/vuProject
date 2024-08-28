<template>
    <div>
        <MapBuildingComponent :builds="store.buildings"/>
    </div>
</template>

<script setup>
import { useBuildingsStore } from '~/store/buildings'

const store = useBuildingsStore()
store.loadData()

</script>
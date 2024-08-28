<template>
  <div style="height:93vh; width:99vw">
    <LMap
      ref="map"
      :zoom="zoom"
      :center="[20.9970077, 105.829120]"
      @click="handleMapClick"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"/>
      <LControl position="bottomleft">
        <div class="flex flex-col">
          <div class="font-semibold text-xl">Thêm tòa nhà</div>
          <ToggleButton class="my-2" v-model="toggleValue" onLabel="Bật" offLabel="Tắt" :style="{ width: '10em', background: '#10B981', color: 'white'} " />
          <Button label="Lưu" @click="save" class="my-2"/>
          <Button label="Hủy bỏ" @click="reset" class="my-2" />
        </div>
      </LControl>

      <Dialog
        header="Thêm tòa nhà"
        v-model:visible="display"
        :breakpoints="{ '960px': '75vw' }"
        :style="{ width: '30vw' }"
        :modal="true"
        @update:visible="store.resetInputBuilding()"
      >
        <InputComponent />
        <template #footer>
          <Button label="Submit" @click="close" />
        </template>
      </Dialog>

      <template v-for="build in store.buildings" :key="build.id">
        <LMarker 
          :lat-lng="[build.lat, build.lng]" 
          :draggable="true" 
          @moveend="updatePosition($event, build)"
        >
          <LPopup>
            Tên tòa nhà: {{ build.name }}<br>
            Địa chỉ: {{ build.address }}<br>
            Kinh độ: {{ build.lat }}<br>
            Vĩ độ: {{ build.lng }} <br>
            <Button label="Xóa" @click="store.deleteBuilding(build.id)" />
          </LPopup>
        </LMarker>
      </template>
    </LMap>
  </div>
</template>

<script setup>
import L from 'leaflet'
import { ref } from 'vue'
import { useBuildingsStore } from '~/store/buildings'

const store = useBuildingsStore()
const props = defineProps(['builds'])
const zoom = ref(18)
const toggleValue = ref(false)
const display = ref(false)
const map = ref(null)
const { $swal } = useNuxtApp()
const tempBuildings = ref(JSON.parse(JSON.stringify(props.builds))) 

function close() {
  store.addBuilding()
  display.value = false
  $swal.fire({
    icon: 'success',
    title: 'Đã thêm',
    text: 'Thêm mới thành công',
  })
}

function onMapClick(e) {
  store.inputBuilding.lat = e.latlng.lat
  store.inputBuilding.lng = e.latlng.lng
  display.value = true
}

function handleMapClick(e) {
  if (toggleValue.value) {
    onMapClick(e)
  }
}

function save() {
  store.saveData()
  tempBuildings.value = JSON.parse(JSON.stringify(store.buildings))
  $swal.fire({
    icon: 'success',
    title: 'Đã Lưu',
    text: 'Lưu thành công',
  })
}

function reset() {
  store.buildings.forEach((building, index) => {
    const tempBuilding = tempBuildings.value[index]
    if (tempBuilding) {
      Object.assign(building, tempBuilding)
    }
  })
}

function updatePosition(event, building) {
  const marker = event.target
  const position = marker.getLatLng()
  building.lat = position.lat
  building.lng = position.lng
  console.log(position)
}
</script>

<style scoped>
.p-togglebutton::before {
  background-color: #10B981 !important; /* Green when active */
}
</style>

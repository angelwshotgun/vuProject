<template>
  <form>
    <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-home"></i>
      </InputGroupAddon>
      <InputText
        name="name"
        placeholder="Name"
        v-model="store.inputBuilding.name"
      />
    </InputGroup>
    <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-map-marker"></i>
      </InputGroupAddon>
      <InputText
        name="address"
        placeholder="Address"
        v-model="store.inputBuilding.address"
      />
    </InputGroup>
    <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-user"></i>
      </InputGroupAddon>
      <InputText
        name="representative"
        placeholder="Representative"
        v-model="store.inputBuilding.representative"
      />
    </InputGroup>
    <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-phone"></i>
      </InputGroupAddon>
      <InputText
        name="phone"
        placeholder="Phone"
        v-model="store.inputBuilding.phone"
      />
    </InputGroup>
    <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-id-card"></i>
      </InputGroupAddon>
      <InputText
        name="cccd"
        placeholder="Id Card"
        v-model="store.inputBuilding.cccd"
      />
    </InputGroup>
    <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-calendar"></i>
      </InputGroupAddon>
      <DatePicker
        name="cccdDate"
        showButtonBar
        placeholder="CCCD Date"
        :model-value="cccdDate"
        @update:model-value="updateCccdDate"
        dateFormat="dd/mm/yy"
      />
    </InputGroup>
    <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-arrows-h"></i>
      </InputGroupAddon>
      <InputText
        name="lat"
        placeholder="Latitude"
        v-model="store.inputBuilding.lat"
      />
    </InputGroup>
    <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-arrows-v"></i>
      </InputGroupAddon>
      <InputText
        name="lng"
        placeholder="Longitude"
        v-model="store.inputBuilding.lng"
      />
    </InputGroup>
  </form>
</template>

<script setup>
import { useBuildingsStore } from "~/store/buildings";
import { ref } from "vue";
const store = useBuildingsStore();
const cccdDate = computed(() => {
  if (store.inputBuilding.cccdDate) {
    return new Date(store.reformatDate(store.inputBuilding.cccdDate))
  }
  return null
})

// Function to update the cccdDate in the store
const updateCccdDate = (newDate) => {
  store.setInputBuildingCccdDate(newDate)
}
</script>

<template>
  <ClientOnly>
    <div class="card">
      <div>Building</div>
      <DataTable
        :value="buildings1"
        :paginator="true"
        :rows="10"
        dataKey="id"
        :rowHover="true"
        v-model:filters="filters1"
        filterDisplay="menu"
        :loading="loading"
        :globalFilterFields="[
          'name',
          'address',
          'representative',
          'phone',
          'cccd',
          'cccdDate',
          'lat',
          'lng',
        ]"
        showGridlines
      >
        <template #header>
          <div class="flex justify-between">
            <Button
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              outlined
              @click="clearFilter()"
            />
            <Dialog
              header="Thêm tòa nhà"
              v-model:visible="display"
              :breakpoints="{ '960px': '75vw' }"
              :style="{ width: '30vw' }"
              :modal="true"
            >
              <InputComponent />
              <template #footer>
                <Button label="Submit" @click="close" />
              </template>
            </Dialog>
            <Button
              type="button"
              icon="pi pi-plus-circle"
              label="Add"
              outlined
              style="width: auto"
              @click="open"
            />
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters1.global.value"
                placeholder="Keyword Search"
              />
            </IconField>
          </div>
        </template>
        <template #empty> No customers found. </template>
        <template #loading> Loading customers data. Please wait. </template>
        <Column field="name" header="Name" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.name }}
          </template>
          <template #filter="{ filterModel }">
            <InputText
              v-model="filterModel.value"
              type="text"
              placeholder="Search by name"
            />
          </template>
        </Column>
        <Column field="address" header="Address" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.address }}
          </template>
          <template #filter="{ filterModel }">
            <InputText
              v-model="filterModel.value"
              type="text"
              placeholder="Search by address"
            />
          </template>
        </Column>
        <Column
          field="representative"
          header="Representative"
          style="min-width: 12rem"
        >
          <template #body="{ data }">
            {{ data.representative }}
          </template>
          <template #filter="{ filterModel }">
            <InputText
              v-model="filterModel.value"
              type="text"
              placeholder="Search by representative"
            />
          </template>
        </Column>
        <Column
          header="Phone"
          filterField="phone"
          dataType="numeric"
          style="min-width: 10rem"
        >
          <template #body="{ data }">
            {{ data.phone }}
          </template>
          <template #filter="{ filterModel }">
            <InputNumber
              v-model="filterModel.value"
              type="number"
              placeholder="Search by phone number"
            />
          </template>
        </Column>
        <Column field="cccd" header="Id Card" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.cccd }}
          </template>
          <template #filter="{ filterModel }">
            <InputText
              v-model="filterModel.value"
              type="text"
              placeholder="Search by id card"
            />
          </template>
        </Column>
        <Column
          header="Date"
          filterField="cccdDate"
          dataType="date"
          style="min-width: 10rem"
        >
          <template #body="{ data }">
            {{ formatDate(store.reformatDate(data.cccdDate)) }}
          </template>
          <template #filter="{ filterModel }">
            <DatePicker
              v-if="filterModel"
              v-model="filterModel.value"
              dateFormat="mm/dd/yy"
              placeholder="mm/dd/yyyy"
            />
          </template>
        </Column>
        <Column field="lat" header="Latitude" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.lat }}
          </template>
          <template #filter="{ filterModel }">
            <InputText
              v-model="filterModel.value"
              type="text"
              placeholder="Search by latitude"
            />
          </template>
        </Column>
        <Column field="lng" header="Longitude" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.lng }}
          </template>
          <template #filter="{ filterModel }">
            <InputText
              v-model="filterModel.value"
              type="text"
              placeholder="Search by longitude"
            />
          </template>
        </Column>
        <Column header="Action" field="action" style="min-height: 12rem">
          <template #body="{ data }">
            <Button
              label="Edit"
              icon="pi pi-pencil"
              severity="warning"
              style="width: auto"
              class="mr-2"
              @click="open1(data.id)"
            />
            <Dialog
              header="Sửa tòa nhà"
              :visible="dialogVisibilityMap.get(data.id)"
              :breakpoints="{ '960px': '75vw' }"
              :style="{ width: '30vw' }"
              :modal="true"
              @update:visible="close2(data.id)"
            >
              <InputComponent />
              <template #footer>
                <Button label="Submit" @click="close1(data.id)" />
              </template>
            </Dialog>
            <Button
              label="Delete"
              icon="pi pi-trash"
              severity="danger"
              style="width: auto"
              @click="openConfirmation(data.id)"
            />
            <Dialog
              header="Confirmation"
              :visible="displayConfirmationMap.get(data.id)"
              :style="{ width: '350px' }"
              :modal="true"
              @update:visible="closeConfirmation(data.id)"
            >
              <div class="flex items-center justify-center">
                <i
                  class="pi pi-exclamation-triangle mr-4"
                  style="font-size: 2rem"
                />
                <span>Are you sure you want to proceed?</span>
              </div>
              <template #footer>
                <Button
                  label="No"
                  icon="pi pi-times"
                  @click="closeConfirmation(data.id)"
                  text
                  severity="secondary"
                />
                <Button
                  label="Yes"
                  icon="pi pi-check"
                  @click="deteleBuilding(data.id)"
                  severity="danger"
                  outlined
                  autofocus
                />
              </template>
            </Dialog>
          </template>
        </Column>
      </DataTable>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";
import { onBeforeMount, onMounted, ref } from "vue";
import { useBuildingsStore } from "~/store/buildings";

const props = defineProps({
  buildings1: Array,
});
const { $swal } = useNuxtApp();
const store = useBuildingsStore();
const display = ref(false);
const dialogVisibilityMap = ref(new Map());
const displayConfirmationMap = ref(new Map());

function open() {
  display.value = true;
}
function open1(id: number) {
  dialogVisibilityMap.value.set(id, true);
  store.setInputBuildingById(id);
}
function close() {
  store.addBuilding();
  display.value = false;
  $swal.fire({
    icon: "success",
    title: "Đã thêm",
    text: "Thêm mới thành công",
  });
}
function close1(id: number) {
  store.updateBuilding();
  dialogVisibilityMap.value.set(id, false);
  $swal.fire({
    icon: "success",
    title: "Đã sửa",
    text: "Sửa thành công",
  });
}
function close2(id: number) {
  dialogVisibilityMap.value.set(id, false);
}
function deteleBuilding(id: number) {
  store.deleteBuilding(id);
  displayConfirmationMap.value.set(id, false);
  $swal.fire({
    icon: "success",
    title: "Đã xóa",
    text: "Xóa thành công",
  });
}
function openConfirmation(id: number) {
  displayConfirmationMap.value.set(id, true);
}

function closeConfirmation(id: number) {
  displayConfirmationMap.value.set(id, false);
}
const filters1 = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  address: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  representative: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  phone: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  cccd: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  cccdDate: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
  },
  lat: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  lng: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
});

const loading = ref();

onMounted(async () => {
  loading.value = true; // Bắt đầu loading
  initFilters();
  loading.value = false; // Kết thúc loading
});
function formatDate(value: {
  toLocaleDateString: (
    arg0: string,
    arg1: { day: string; month: string; year: string }
  ) => any;
}) {
  return value.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function initFilters() {
  filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    address: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    representative: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    phone: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    cccd: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    cccdDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    lat: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    lng: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  };
}

function clearFilter() {
  initFilters();
}
</script>

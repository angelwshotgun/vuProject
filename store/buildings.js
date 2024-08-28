import { defineStore } from 'pinia'
const today = ref(new Date())
export const useBuildingsStore = defineStore('buildings', {
  state: () => ({
    buildings: [],
    inputBuilding: {
      id: '',
      name: '',
      address: '',
      representative: '',
      phone: '',
      cccd: '',
      cccdDate: today,
      lat: '',
      lng: ''
    },
    isEditing: false,
    handleId: '',
    find: ''
  }),
  getters: {
    filteredBuildings: (state) => {
      return state.buildings.filter(building => 
        building.name.toLowerCase().includes(state.find.toLowerCase())
      )
    }
  },
  actions: {
    async addBuilding() {
      const tempBuilding = { 
        ...this.inputBuilding, 
        id: this.buildings.length + 1,
        cccdDate: this.formatDate(this.inputBuilding.cccdDate)
      }
      this.buildings.push(tempBuilding)
      this.resetInputBuilding()
      await this.saveData()  // Lưu dữ liệu vào API
    },
    async updateBuilding() {
      const index = this.buildings.findIndex(b => b.id === this.inputBuilding.id)
      if (index !== -1) {
        this.buildings[index] = this.inputBuilding
        this.buildings[index].cccdDate = this.formatDate(this.inputBuilding.cccdDate)
      }
      this.resetInputBuilding()
      await this.saveData()  // Lưu dữ liệu vào API
    },
    async deleteBuilding(id) {
      this.buildings = this.buildings.filter(b => b.id !== id)
      await this.saveData()  // Lưu dữ liệu sau khi xóa
    },
    setInputBuildingById(id) {
      const tempBuilding = this.buildings.find(b => b.id === id)
      this.inputBuilding = tempBuilding
    },
    setInputBuilding(building) {
      this.inputBuilding = { ...building }
    },
    resetInputBuilding() {
      this.inputBuilding = {
        id: this.buildings.length + 1,
        name: '',
        address: '',
        representative: '',
        phone: '',
        cccd: '',
        cccdDate: today,
        lat: '',
        lng: ''
      }
    },
    setIsEditing(value) {
      this.isEditing = value
    },
    setHandleId(id) {
      this.handleId = id
    },
    setFind(value) {
      this.find = value
    },
    formatDate(date) {  
      const day = String(date.getDate()).padStart(2, '0'); // Get the day, pad with 0 if necessary
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month, 0-based so add 1
      const year = date.getFullYear(); // Get the full year
      console.log(date)
      return `${month}/${day}/${year}`
    },
    reformatDate(date) {  
      const [day, month, year] = date.split('/')
      return new Date(year, month - 1, day)
    },
    async loadData() {
      try {
        const response = await $fetch('/api/buildings')
        if (response.buildings) {
          this.buildings = response.buildings
        }
      } catch (error) {
        console.error('Failed to load buildings:', error)
      }
    },
    
    async saveData() {
      try {
        const response = await $fetch('/api/buildings', {
          method: 'POST',
          body: this.buildings
        })
        console.log(response.message)
      } catch (error) {
        console.error('Failed to save buildings:', error)
      }
    },
    
    async clearData() {
      try {
        const response = await $fetch(`/api/buildings`, {
          method: 'DELETE'
        })
        this.buildings = []
        console.log(response.message)
      } catch (error) {
        console.error('Failed to clear buildings:', error)
      }
    }
  }
})

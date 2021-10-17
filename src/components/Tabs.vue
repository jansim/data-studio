<template>
  <div class="tabs">
    <slot/>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Tabs',
  props: {
    default: {
      type: String,
      required: true
    }
  },
  // Provide activeTab for child tabs
  provide () {
    return {
      activeTab: computed(() => this.activeTab)
    }
  },
  data () {
    return {
      activeTab: this.default
    }
  },
  methods: {
    setActiveTab (newTabId) {
      this.activeTab = newTabId
    }
  }
}
</script>

<style lang="css" scoped>
</style>

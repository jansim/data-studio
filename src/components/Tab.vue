<template>
  <div class="tab-title" :class="{'is-active': isActive}" @click="activate">
    {{ title }}
  </div>

  <div class="tab" v-if="isActive">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Tab',
  inject: ['activeTab'],
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    isActive () {
      return this.activeTab == this.id
    }
  },
  methods: {
    activate () {
      this.$parent.setActiveTab(this.id)
    }
  }
}
</script>

<style lang="css" scoped>
.is-active {
  font-weight: bold;
}
</style>

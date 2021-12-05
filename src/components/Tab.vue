<template>
  <div class="tab" :class="{'is-active': isActive}" @click="onClick">
    {{ title }}
  </div>
</template>

<script>
export default {
  name: 'Tab',
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    isActive: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    onClick () {
      this.$emit('select', this.id)
    }
  }
}
</script>

<style lang="css" scoped>
.tab {
  padding: .5rem .75rem;
  cursor: pointer;
}

.tab:hover {
  color: #189ab4;
}

.tab.is-active {
  font-weight: bold;
}
</style>

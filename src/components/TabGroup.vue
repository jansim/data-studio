<template>
  <div class="tab-group">
    <div class="tab-group-name"> {{ name }} </div>

    <slot/>
  </div>
</template>

<script>
export default {
  name: 'TabGroup',
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="css" scoped>
.tab-group {
  padding-top: 1rem;
  position: relative;
  display: flex;
}
.tab-group-name {
  position: absolute;
  top: 0.25rem;
  left: 0.75rem;
  font-size: 0.8rem;
}
</style>

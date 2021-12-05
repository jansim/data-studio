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
  top: 0;
  /* left: 0; */
}
</style>

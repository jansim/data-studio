<template>
  <div class="data-wrangler-wrapper">
    <div ref="wrangler"></div>
  </div>
</template>

<script>
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "./minimal-datawrangler-wrapper";

// Use variable for main state outside of vue scope to avoid errors
let globalMain = undefined;

export default {
  name: 'Wrangler',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  watch: {
    data: {
      immediate: true,
      handler () {
        this.onSourceDataChange();
      }
    }
  },
  methods: {
    onSourceDataChange () {
      if (globalMain) {
        globalMain.redefine('data1', this.data)
      }
    }
  },
  mounted () {
    const runtime = new Runtime();

    const main = runtime.module(define, name => {
      // Register observers

      if (name.includes('viewof')) {
        // Use inspector to bind to page
        return new Inspector(this.$refs.wrangler);
      }
      if (name === "output_data") {
        // Retrieve data through custom observer
        return {
          pending: () => {
            // Loading...
          },
          fulfilled: (value) => {
            this.$emit('newData', value)
          },
          rejected: (error) => {
            console.error('[Wrangler] Retrieving output data failed:', error)
          }
        };
      }
    });

    if (globalMain) {
      console.error('Initializing wrangler twice, this may cause issues.')
    }
    globalMain = main

    this.onSourceDataChange();
  },
  unmounted () {
    globalMain = undefined
  }
}
</script>

<style lang="css" scoped>
/* Hide the header */
:deep(#minimal-datawrangler-wrapper) {
  display: none;
}

/* Hide Variable Definitions */
:deep(.observablehq--inspect) {
 display: none;
}
</style>

<template>
  <div class="data-wrangler-wrapper">
    <div ref="wrangler"></div>
  </div>
</template>

<script>
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "./minimal-datawrangler-wrapper";

// Have to use variable for main state outside of vue scope to avoid errors
let unscopedMain = undefined;

export default {
  name: 'Wrangler',
  data () {
    return {
      main: undefined
    }
  },
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
      if (unscopedMain) {
        unscopedMain.redefine('data1', this.data)
      }
    }
  },
  mounted () {
    const runtime = new Runtime();

    // const main = runtime.module(define);
    // const main = runtime.module(define, Inspector.into(this.$refs.wrangler));
    const main = runtime.module(define, name => {
      console.log("x", name);

      if (!name) {
        return new Inspector(this.$refs.wrangler);
      }
      if (name === "data1") {
        return {
          pending() {
            console.log('pending')
          },
          fulfilled(value) {
            console.log('fulfilled', value)
          },
          rejected(error) {
            console.log('rejected', error)
          }
        };
      }
    });
    main.value("Wrangler").then(value => console.log(value));

    unscopedMain = main
    this.onSourceDataChange();
    // main.value('data1', [{row: 5, name: 'E'},{row: 6, name: 'F'}])

    window.main = main
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

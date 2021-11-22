import {Runtime, Inspector} from "@observablehq/runtime";
import define from "./minimal-datawrangler-wrapper";

import './DataWrangler.css'

// Use variable for main state outside of vue scope to avoid errors
let globalMain = undefined;

export default {
  mount (element, moduleApi) {
    const runtime = new Runtime();

    const main = runtime.module(define, name => {
      // Register observers

      if (name.includes('viewof')) {
        // Use inspector to bind to page
        return new Inspector(element);
      }
      if (name === "output_data") {
        // Retrieve data through custom observer
        return {
          pending: () => {
            // Loading...
          },
          fulfilled: (value) => {
            // The wrangler returns an arquero dataframe with some metadata
            // For now, let's just pass the raw data itself
            const data = value.objects()

            console.warn('Note: Updating of data not yet handled!')
            // TODO: Check for actual differences here!
            // moduleApi.setData(data)
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

    // Manually update data
    const data = moduleApi.getData()
    this.onDataChange(data)
  },

  unmount (element) {
    globalMain = undefined
  },

  onDataChange (newData) {
    if (globalMain) {
      globalMain.redefine('data1', newData)
    }
  }
}
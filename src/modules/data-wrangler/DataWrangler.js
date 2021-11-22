import {Runtime, Inspector} from "@observablehq/runtime";
import define from "./minimal-datawrangler-wrapper";

import './DataWrangler.css'

// Use variable for main state outside of vue scope to avoid errors
let globalMain = undefined;
let clickListener = undefined

const elementSelector = '.code_wrapper'

export default {
  mount (element, moduleApi) {
    const runtime = new Runtime();

    // Manually update data
    const data = moduleApi.getData()

    // Update dataset in the studio
    let updatedData = data
    function updateDataHandler () {
      // Use the new (and updated data)
      moduleApi.setData(updatedData)

      moduleApi.setActiveModule('viewer')
    }

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
            updatedData = value.objects()
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

    // Use updated dataset
    this.onDataChange(data)

    clickListener = function (e) {
      // loop parent nodes from the target to the delegation node
      for (var target = e.target; target && target != this; target = target.parentNode) {
        if (target.matches(elementSelector)) {
          updateDataHandler.call(target, e);
          break;
        }
      }
    }
    element.addEventListener('click', clickListener, false);
  },

  unmount (element) {
    globalMain = undefined
    element.removeEventListener('click', clickListener);
  },

  onDataChange (newData) {
    if (globalMain) {
      globalMain.redefine('data1', newData)
    }
  }
}
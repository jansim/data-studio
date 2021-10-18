import * as deck from '@deck.gl/core'
import * as layers from '@deck.gl/layers'
import * as luma from '@luma.gl/core'
import * as fluentui from '@fluentui/react'
import * as vega from 'vega'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Explorer, use } from '@msrvida/sanddance-explorer'

import "@msrvida/sanddance-explorer/dist/css/sanddance-explorer.css"
import "./sand-dance.css"

fluentui.initializeIcons()

use(fluentui, React, ReactDOM, vega, deck, layers, luma)

let reactApp, explorerInstance

export default {
  mount(element, moduleApi) {
    const data = moduleApi.getData()

    const explorerProps = {
      logoClickUrl: '#',
      mounted: explorer => {
        // Set Instance
        explorerInstance = explorer

        // Load Data
        this.onDataChange(data)
      }
    }

    reactApp = ReactDOM.render(React.createElement(Explorer, explorerProps), element)
  },

  unmount(element, moduleApi) {
    reactApp = undefined
  },

  onDataChange(newData) {
    explorerInstance.load(newData)
  }
}
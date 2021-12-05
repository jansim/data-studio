// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react'
import {Provider} from 'react-redux'
import {render} from 'react-dom'
import store from './src/store'
import App from './src/app.js'

import { from } from 'arquero'
import { addDataToMap } from 'kepler.gl/actions';

export default {
  async mount(element, moduleApi) {
    const Root = () => (
      <Provider store={store}>
        <App />
      </Provider>
    )

    render(<Root />, element)

    const data = await moduleApi.getData()
    this.onDataChange(data)
  },

  unmount(element, moduleApi) {
  },

  onDataChange(newData) {
    // const exampleData = {
    //   fields: [
    //     // Format and type seem to be optional
    //     {name: 'tpep_pickup_datetime', format: 'YYYY-M-D H:m:s', type: 'timestamp'},
    //     {name: 'pickup_longitude', format: '', type: 'real'},
    //     {name: 'pickup_latitude', format: '', type: 'real'}
    //   ],
    //   rows: [
    //     ['2015-01-15 19:05:39 +00:00', -73.99389648, 40.75011063],
    //     ['2015-01-15 19:05:39 +00:00', -73.97642517, 40.73981094],
    //     ['2015-01-15 19:05:40 +00:00', -73.96870422, 40.75424576]
    //   ]
    // };

    const table = from(newData)

    const columns = table.columns()
    const column_names = Object.keys(columns)

    const fields = column_names.map(colname => { return { name: colname }})
    const rows = table.objects({columns: column_names}).map(rowObject => Object.values(rowObject))

    const data = {
      fields,
      rows
    }

    console.log(data)

    const config = {
      visState: {
        filters: [
        ]
      }
    };

    // See https://docs.kepler.gl/#6.-how-to-add-data-to-map
    store.dispatch(addDataToMap({
      datasets: {
        info: {
          label: 'Data',
          id: 'test'
        },
        data
      },
      option: {
        centerMap: true,
        readOnly: false
      },
      config
    }))
  }
}

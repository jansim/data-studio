import React from 'react'
import ReactDOM from 'react-dom'
import PivotTableUI from 'react-pivottable/PivotTableUI'
import 'react-pivottable/pivottable.css'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      pivotState: {
        data: props.data
      }
    }
  }

  render() {
    return (
      <PivotTableUI
        onChange={s => this.setState({ pivotState: s })}
        {...this.state.pivotState}
      />
    )
  }
}

let appInstance
export default {
  async mount(element, moduleApi) {
    const data = await moduleApi.getData()

    appInstance = ReactDOM.render(<App data={data} />, element)
  },

  unmount(element, moduleApi) {
    // TODO: Properly unmount, if this module will ever run outside of an iframe
  },

  async onDataChange(newData) {
    appInstance.setState({ pivotState: { data: newData } })
  }
}

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import plotly from 'plotly.js/dist/plotly';
import PlotlyEditor from 'react-chart-editor';
import 'react-chart-editor/lib/react-chart-editor.css';

const config = {editable: true};

function convertDataToDataSourceOptions(dataSources) {
  // Expects an Object with column names as keys and arrays as values
  // (i.e. dataSources). Converts that into a list of objects containing
  // the column names.
  return Object.keys(dataSources).map(name => ({
    value: name,
    label: name,
  }));
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          // The chart editor library expects data to be passed twice in different formats.
          // First as a rather common, column based format called dataSources and
          // then again as an array of objects with the column names.
          // Note: It might be possible to supply additional information in the 'label'
          // field here
          dataSources: props.dataSources,
          dataSourceOptions: props.dataSourceOptions,

          editorState: {
            // Internal plotly data, not to be confused with the actual data
            data: [],
            layout: {},
            frames: [],
          }
        };
    }

    render() {
        return (
          <PlotlyEditor
            data={this.state.editorState.data}
            layout={this.state.editorState.layout}
            config={config}
            frames={this.state.editorState.frames}
            dataSources={this.state.dataSources}
            dataSourceOptions={this.state.dataSourceOptions}
            plotly={plotly}
            onUpdate={(data, layout, frames) => this.setState({editorState: {data, layout, frames}})}
            useResizeHandler
            debug
            advancedTraceTypeSelector
          />
        );
    }
}

let appInstance
let _moduleApi
export default {
  async mount(element, moduleApi) {
    _moduleApi = moduleApi

    const data = await moduleApi.getData()
    const dataSourceOptions = convertDataToDataSourceOptions(data)

    console.log(data, dataSourceOptions)

    appInstance = ReactDOM.render(<App dataSources={data} dataSourceOptions={dataSourceOptions} />, element);
  },

  unmount(element, moduleApi) {
    // TODO: Properly unmount, if this module will ever run outside of an iframe
  },

  async onDataChange(newData) {
    const dataSourceOptions = convertDataToDataSourceOptions(newData)
    appInstance.setState({ dataSources: newData, dataSourceOptions })
  }
}

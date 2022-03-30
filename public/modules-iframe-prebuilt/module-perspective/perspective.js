import perspective from "@finos/perspective";

import "@finos/perspective-viewer";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";

// Different theme options available!
import "@finos/perspective-viewer/dist/css/material.css";

// TODO: Replace these global variables with instance properties
var viewer
var table
var worker

export default {
  async mount(element, moduleApi) {
    viewer = document.createElement("perspective-viewer");
    await viewer.toggleConfig();

    worker = perspective.worker()
    const data = await moduleApi.getData()

    // Create a new worker, then a new table promise on that worker.
    table = await worker.table(data);

    // Bind the viewer element to this table.
    viewer.load(table);
    element.appendChild(viewer);
  },

  unmount(element, moduleApi) {
    // When not running in an iframe, we would also need to call delete here
    // (see perspective docs for more info)
    viewer = undefined;
    table = undefined;
    worker = undefined;
  },

  async onDataChange(newData) {
    const old_table = table;

    table = await worker.table(newData);
    // Note: This will still trigger an error, due to some lingering settings persisting
    await viewer.load(table);

    old_table.delete();
  }
}

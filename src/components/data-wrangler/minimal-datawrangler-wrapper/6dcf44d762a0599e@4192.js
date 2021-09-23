// https://observablehq.com/@observablehq/data-wrangler@4192
import define1 from "./ab3e70b29c480e6d@79.js";
import define2 from "./79750b3b8e929d9d@221.js";
import define3 from "./1371b3b2446a73b4@306.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["protests.csv",new URL("./files/100ba6c9ab25d7a4687eb6bc46809219508a9faf2b7ade6c7034b0490cc7709fcfca7a50f4b76fda051310f6a4898815c53a702418c3d8644f767e3a6e44ac7e",import.meta.url)],["icons@4.json",new URL("./files/3c2fd71a8faeeebda50f3647621d658fd2943e8e9c4661ae86f05309b75b5569b1a6731a3058b51726f88675fa46e9b3b57be9ec5e411fd76bb415c3d7730823",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Data Wrangler`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Data wrangling is often a complex and time consuming part of quantitative work.
This (experimental) \`Wrangler\` function provides an interface to guide **code
composition** and also **display the results**. It uses the
[Arquero](https://observablehq.com/@uwdata/introducing-arquero) package, a
robust data wrangling library based on the grammar of data manipulation.

To get started, import the \`Wrangler\` function from this notebook:

\`\`\`js
  // Import the function and arquero operations into your notebook
  import {Wrangler, op} from "@observablehq/data-wrangler"
\`\`\`

Then, pass your data into the \`Wrangler\` function, and access the results:

\`\`\`js
  // Create an interface to wrangle your data
  Wrangler(data)
\`\`\`

As an example, here is an exploration of U.S. protest data
([source](https://countlove.org/faq.html)). You can also upload your own data
using this button:
`
)});
  main.variable(observer("viewof data")).define("viewof data", ["dataInput","FileAttachment"], async function(dataInput,FileAttachment){return(
dataInput({
  initialValue: await FileAttachment("protests.csv").csv({ typed: true })
})
)});
  main.variable(observer("data")).define("data", ["Generators", "viewof data"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`---`
)});
  main.variable(observer("fullscreen")).define("fullscreen", ["html"], function(html)
{
  const button = html`<button>View Fullscreen`;
  button.onclick = () => {
    const wrangler_cell =  button.parentElement.nextElementSibling
    wrangler_cell.style.background = "#fff";
    wrangler_cell.requestFullscreen();
  }
  return button;
}
);
  main.variable(observer()).define(["Wrangler","data"], function(Wrangler,data){return(
Wrangler(data)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`<hr/>`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`If you'd like to access the code or data created, you can leverage an Observable
[\`viewof\`](https://observablehq.com/@observablehq/introduction-to-views)
statement:

\`\`\`js
// Create a view of the wrangled data
viewof wrangled = Wrangler(data)

// In another cell, access the code generated or the results!
wrangled.data // returns an arquero table, you can call .view() or .objects()
wrangled.code // access the code as a string
\`\`\`
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Implementation`
)});
  main.variable(observer("Wrangler")).define("Wrangler", ["html","get_cols","id_generator","operations","Event","render_inputs_panel","get_code_expression","render_code_panel","render_results_panel","render_operations_panel","aq","make_styles"], function(html,get_cols,id_generator,operations,Event,render_inputs_panel,get_code_expression,render_code_panel,render_results_panel,render_operations_panel,aq,make_styles){return(
(data = [], data2 = []) => {
  // Keep track of all the inputs
  let inputs = [];

  // Set up the three panels for the UI
  let wrapper = html`<div class="wrangler">`;
  let wrangler_container = html`<div class="wrangler_container">`;
  let right_panel = html`<div class="right_panel"><div class="section_header">Transformations Applied</div></div>`;
  let left_panel = html`<div class="left_panel">`;
  let bottom_panel = html`<div class="bottom_panel">`;
  wrangler_container.appendChild(left_panel);
  wrangler_container.appendChild(right_panel);
  wrapper.appendChild(wrangler_container);
  wrapper.appendChild(bottom_panel);

  // Function to add an operation (callback for the render_operations_panel)
  const addOperation = (operation) => {
    // Get current state of data and columns for building next input
    let data, cols;
    if (operation.includes("join")) {
      data = [wrapper.value.data.objects(), data2];
      cols = data.map(get_cols);
    } else {
      data = wrapper.value.data.objects();
      cols = get_cols(data);
    }

    const id = id_generator();

    // Get default value
    const value = operations[operation].get_default_value
      ? operations[operation].get_default_value(cols, data)
      : [cols[0].label];

    const options = operation === "filter" ? { data } : {};
    inputs.push({ id, cols, value, options, type: operation });
    update_inputs();
  };

  const update_wrapper_value = (value) => {
    wrapper.value = value;
    wrapper.dispatchEvent(new Event("input", { bubbles: true }));
  };

  // Update inputs panel
  const update_inputs = () => {
    right_panel.replaceChild(
      render_inputs_panel(inputs, update_code_and_results),
      right_panel.querySelector(".inputs_wrapper")
    );
  };

  // Update coee and results
  const update_code_and_results = (updated_inputs) => {
    inputs = updated_inputs;
    const expression = get_code_expression(inputs);
    right_panel.replaceChild(
      render_code_panel(expression),
      right_panel.querySelector(".code_wrapper")
    );

    bottom_panel.replaceChild(
      render_results_panel(expression, data, data2, update_wrapper_value),
      bottom_panel.querySelector(".results_wrapper")
    );
  };

  // Append the initial state
  left_panel.appendChild(
    html`${render_operations_panel(operations, addOperation)}`
  );
  right_panel.appendChild(
    html`${render_inputs_panel(inputs, update_code_and_results)}`
  );

  right_panel.appendChild(html`${render_code_panel(get_code_expression(inputs))}`);
  bottom_panel.appendChild(html`${render_results_panel("data", data, data2)}`);

  wrapper.value = { data: aq.from(data), code: "" }; // initial value

  // Append styles
  wrapper.appendChild(make_styles());
  return wrapper;
}
)});
  main.variable(observer("render_operations_panel")).define("render_operations_panel", ["html","OperationsMenu","make_docs_icon"], function(html,OperationsMenu,make_docs_icon){return(
(operations = [], callback = () => null) => {
  // Visual elements
  const wrapper = html`<div class="operations_wrapper">`;
  const search = html`<form style="display:block;"><input style="text-align:left;" name="op_search" type="text" class="inline" placeholder="Search operations..." /></form>`;

  // Search through operations
  search.oninput = () => {    
    const value = search.op_search.value.toLowerCase();
    const filtered_operations = {};
    Object.keys(operations)
      .filter(
        (d) =>
          d.includes(value) ||
          operations[d].description?.includes(value) ||
          operations[d].type?.includes(value)
      )
      .forEach((d) => (filtered_operations[d] = operations[d]));
    left_panel.replaceChild(
      OperationsMenu(filtered_operations, callback),
      left_panel.querySelector(".menu_wrapper")
    );    
  };

  const left_panel = html`<div class="left_panel">
    <div class="section_header">
      Data Wrangler
      <span class="docs_link">
        <a style="text-decoration:none;" href="https://uwdata.github.io/arquero/api/verbs" target="_blank"><span style="vertical-align:top;line-height:1.6;">${make_docs_icon()}</span><span style="vertical-align:top;line-height:1.6;">Docs</span></a>     
    </span>
  </div>
  ${search}
  <div class="menu_wrapper" />
</div>`;

  search.oninput();
  wrapper.appendChild(left_panel);
  return wrapper;
}
)});
  main.variable(observer("render_code_panel")).define("render_code_panel", ["html","copy_code_button","format_code"], function(html,copy_code_button,format_code){return(
(expression = "") => {
  // Panel to contain the transformations and code
  const comment = `// To use copied code replace "data" with your own variable\n`;

  const end = `\n\t// .objects() // Uncomment to return an array of objects`;
  
  const wrapper = html`
    <div class="code_wrapper">
      <div class="section_header" style="display:block;border-bottom:none">Code 
        <div class="code_instructions">
          <span>Copy into a cell to save work</span>
          ${copy_code_button(comment + expression + end)}
        </div>
      </div>
      ${format_code(comment + expression)}
  </div>`;

  return wrapper;
}
)});
  main.variable(observer("render_results_panel")).define("render_results_panel", ["html","evaluate","aq","op","display_error","Inputs"], function(html,evaluate,aq,op,display_error,Inputs){return(
(expression, data, data2, callback = () => null) => {
  const wrapper = html`<div class="results_wrapper"><div class="section_header">Results</div></div>`;
  // Update the displayed data
  let wrangled_data;
  let err_message;
  try {
    wrangled_data = evaluate("return " + expression, { data, aq, op, data2 });
  } catch (err) {
    err_message = display_error(err);
  }

  // Passing an error if there are no results
  if (!data.length) err_message = display_error({ message: "No results" });

  // Display the error or results
  let results;
  if(err_message) {
    results = err_message
  } else {
    results = Inputs.table(wrangled_data, { height: 150});
    // Set a minimum width to the table for mobile
    results.appendChild(html`<style>table {min-width: ${Object.keys(data[0]).length * 75}px}</style>`)
  }
  
  wrapper.appendChild(results);

  // Use a callback to set the value of the parent
  callback({ data: wrangled_data, code: expression });
  return wrapper;
}
)});
  main.variable(observer("render_inputs_panel")).define("render_inputs_panel", ["html","render_inputs"], function(html,render_inputs){return(
(inputs = [], callback = () => null) => {
  // Panel to contain the transformations and code
  const wrapper = html`<div class="inputs_wrapper">  
</div>`;

  const inputs_wrapper = html`<div class="event_form" style="height: 300px;display: inline-block;font:var(--sans-serif); padding-bottom:5px; " />`;

  wrapper.append(inputs_wrapper);
  // Prompt to add operations
  const prompt = html`<div class="prompt_action">Add transformations using the list&nbsp;<span class="hide_large">above</span><span class="hide_small">to the left</span>.</div>`;

  const clear = html`<div class="clear_button">Clear all</div>`;
  clear.onclick = () => {
    inputs = [];
    callback(inputs);
    inputs_wrapper.innerHTML = "";
    inputs_wrapper.appendChild(prompt);
  };
  // Event for the form (when events are deleted or changed through the UI itself)
  inputs_wrapper.oninput = (trigger) => {
    // If there aren't any inputs, prompt the user to create inputs
    if (inputs?.length === 0) {
      inputs_wrapper.appendChild(prompt);
      inputs_wrapper.removeChild(clear);
    }
    // Update the inputs array if the event comes from dragging (reorders them)
    if (trigger?.type === "drag") inputs = trigger.inputs;
    // Otherwise, get id and value of form, update the inputs array
    else if (trigger.target?.form?.id) {
      const id = trigger.target.form.id;
      const value = trigger.target.form.value;
      const index = inputs.findIndex((d) => d.id === id);
      inputs[index].value = value;
    }
    // Run callback function (to pass information to parent)
    callback(inputs);
  };

  // Draw the initial state (prompt or inputs)
  if (inputs?.length) {
    render_inputs(inputs, inputs_wrapper);
    inputs_wrapper.appendChild(clear);
  } else inputs_wrapper.appendChild(prompt);

  return wrapper;
}
)});
  main.variable(observer("render_inputs")).define("render_inputs", ["d3","make_hamburger_icon","html","operations","Event"], function(d3,make_hamburger_icon,html,operations,Event){return(
(input_arr, wrapper) => {
  function redraw(data) {
    d3.select(wrapper)
      .selectAll(".item")
      .data(data, (d) => d.id)
      .join("div")
      .selectAll("span")
      .style("transform", `translate(0px, 0px)`);

    // Fire an event on the parent
    wrapper.oninput({ type: "drag", inputs: data });
  }

  function dragged(event, d) {
    const parent = this.parentNode; // wrapper span around the hamburger menu
    const nextSiblingY = parent.parentNode.nextElementSibling?.offsetTop;
    const y = parent.offsetTop;
    const prevSiblingY = parent.parentNode.previousElementSibling?.offsetTop;

    // Move all the child nodes
    d3.select(parent) // content
      .selectAll(function () {
        return parent.childNodes;
      })
      .style("transform", `translate(0px, ${event.y - this.offsetTop - 10}px)`);

    // Shift up or down
    if (y + event.y > nextSiblingY || y + event.y < prevSiblingY) {
      const index = input_arr.findIndex((ele) => ele.id === d.id);
      const new_pos = y + event.y > nextSiblingY ? index + 1 : index - 1;
      input_arr.splice(new_pos, 0, input_arr.splice(index, 1)[0]);
      redraw(input_arr);
    }
  }

  function dragended(event, d) {
    redraw(input_arr);
  }

  const drag = d3.drag().on("drag", dragged).on("end", dragended);

  const divs = d3
    .select(wrapper)
    .selectAll("div")
    .data(input_arr, (d) => d.id)
    .join(
      (enter) => {
        const divs = enter.append("div").attr("class", "item");

        // Content
        const content = divs
          .append("span")
          .style("display", "inline-block")
          .style("transform", `translate(0px, 0px)`)
          .style("width", "100%")
          .attr("class", "content");

        // Hamburger icons
        content
          .append("span")
          .style("vertical-align", "top")
          .style("cursor", "pointer")
          .style("display", "inline-block")
          .call(drag)
          .each(function (d) {
            this.innerHTML = make_hamburger_icon();
          });

        // Remove icons
        content
          .append("span")
          .attr("class", "remove")
          .text("x")
          .on("click", (event, value) => {
            const index = input_arr.findIndex((ele) => ele.id === value.id);
            input_arr.splice(index, 1);
            redraw(input_arr);
          });

        // Craete the visual elements (forms)
        content.each(function (d) {
          this.appendChild(
            html`<span style="width:calc(100% - 30px);display:inline-block;">${operations[
              d.type
            ].make_input(d)}</span>`
          );
        });

        return divs;
      },
      (update) => update,
      (exit) => exit.remove()
    );
  wrapper.dispatchEvent(new Event("input", { bubbles: true }));
}
)});
  main.variable(observer("OperationsMenu")).define("OperationsMenu", ["html","capitalize","icons"], function(html,capitalize,icons){return(
(
  operations = ["semijoin"],
  update = (d) => d,
  hoverUpdate = (d) => d
) => {
  const icon_width = 85;
  const padding = 15;
  // const categories = Object.keys(operations)
  const categories = ["core", "join", "reshape", "clean", "set"];
  const wrapper = html`<div class="menu_wrapper">`;
  categories.forEach((category) => {
    const ops = Object.keys(operations).filter(
      (d) => operations[d].type === category
    );
    let warning = "";
    if (category === "join") {
      warning = html`<br/><span class="type_info"><em>To join, pass in a second dataset:</em><br/><code>Wrangler(data, data2)</code></span>`;
    } else if (category === "reshape") {
      warning = html`<br/><span class="type_info"><em>These functions can dramatically increase data size.`;
    } else if (category === "set") {
      warning = html`<br/><span class="type_info"><em>For sets, pass in a second data set:</em> <code>Wrangler(data, data2)</code></span>`;
    }
    const category_wrapper = html`<div style="font:13px system-ui,sans-serif;margin-bottom:5px;">
          <span style="font-size:.875rem;line-height:25px;">${capitalize(
            category
          )} operations</span>
    ${warning}</div>`;

    ops.forEach((d) => {
      const value = operations[d];
      const text = value.description;
      const control = html`<div class="icon_menu_wrapper">
        ${icons[d]}
        <p class="icon_info">
          <span>${d}\n</span>
          <span style="opacity:.3; font-size:.7rem;">${text}</span>
        </p></div>
      `;
      control.onclick = () => update(d);
    
      category_wrapper.appendChild(control);
    });
    wrapper.appendChild(category_wrapper);
  });
  return wrapper;
}
)});
  main.variable(observer("operations")).define("operations", ["SelectInput","FilterInput","d3","OrderbyInput","DeriveInput","prefixVarsInFormula","RenameInput","GroupbyInput","RollupInput","CountInput","SampleInput","SliceInput","RelocateInput","ReifyInput","UngroupInput","UnorderInput","JoinInput","FoldInput","PivotInput","SpreadInput","UnrollInput","DedupeInput","ImputeInput","SetInput"], function(SelectInput,FilterInput,d3,OrderbyInput,DeriveInput,prefixVarsInFormula,RenameInput,GroupbyInput,RollupInput,CountInput,SampleInput,SliceInput,RelocateInput,ReifyInput,UngroupInput,UnorderInput,JoinInput,FoldInput,PivotInput,SpreadInput,UnrollInput,DedupeInput,ImputeInput,SetInput){return(
{
  select: {
    make_input: (config) => SelectInput(config),
    description: "choose columns",
    type: "core",
    get_syntax: (d) => {
      if (!d.value) return "";
      // Wrap in quotes
      const quoted_values = d.value.map((d) => `'${d}'`).join(",");
      if (!quoted_values) return "";
      return `.select(${quoted_values})`;
    }
  },
  filter: {
    make_input: (config) => FilterInput(config),
    description: "choose rows",
    type: "core",
    get_default_value: (cols, data) => {
      const comparison_type = cols[0].type === "categorical" ? "match" : "gt";
      const starter_value =
        cols[0].type === "categorical"
          ? ""
          : d3.mean(data, (d) => +d[cols[0].label]);
      return [cols[0].label, comparison_type, starter_value];
    },
    get_syntax: (d) => {
      // Implement this logic better
      const [col, comparison, value] = d.value;
      if (value === "") return "";
      if (comparison.includes("equal")) {
        const comparison_symbol = comparison === "equal" ? "===" : "!==";
        return `.filter(d => d["${col}"] ${comparison_symbol} "${value}")`;
      } else if (comparison === "match") {
        return `.filter(d => op.match(d["${col}"], "${value}"))`;
      } else if (comparison.endsWith("with")) {
        return `.filter(d => op.${comparison}(d["${col}"], "${value}"))`;
      } else if (comparison === "lt" || comparison === "gt") {
        const comparison_symbol = comparison === "lt" ? "<" : ">";
        return `.filter(d => d["${col}"] ${comparison_symbol} ${+value})`;
      }
      return "";
    }
  },
  orderby: {
    make_input: (config) => OrderbyInput(config),
    description: "sort rows",
    type: "core",
    get_syntax: (d) => {
      const [order_col, order] = d.value;
      if (order === "Descending") {
        return `.orderby(aq.desc("${order_col}"))`;
      } else {
        return `.orderby("${order_col}")`;
      }
    }
  },
  derive: {
    make_input: (config) => DeriveInput(config),
    description: "add a new column",
    type: "core",
    get_default_value: (cols) => [],
    get_syntax: (d) => {
      const [col_name, col_value] = d.value;
      if (!col_name || !col_value) return "";
      return `.derive({${col_name}: d => ${prefixVarsInFormula(col_value)}})`;
    }
  },
  rename: {
    make_input: (config) => RenameInput(config),
    description: "change a column's name",
    type: "core",
    get_syntax: (d) => {
      let [old_name, new_name] = d.value;
      if (!new_name) return "";
      if (old_name.includes(" ")) old_name = `"${old_name}"`;
      return `.rename({${old_name}: "${new_name}"})`;
    }
  },
  groupby: {
    make_input: (config) => GroupbyInput(config),
    description: "associate rows",
    type: "core",
    get_syntax: (d) => {
      const quoted_groups = d.value.map((d) => `'${d}'`).join(",");
      return `.groupby(${quoted_groups})`;
    }
  },
  rollup: {
    make_input: (config) => RollupInput(config),
    description: "compute column statistics",
    type: "core",
    get_default_value: (cols) => [
      cols.filter((d) => d.type === "continuous")[0].label,
      ["mean", "count"]
    ],
    get_syntax: (d) => {
      const [summary_col, metrics] = d.value;
      if (!metrics.length) return "";
      const str = metrics.map((d, i) => {
        const end = i === metrics.length - 1 ? "" : ",\n\t\t";
        const arg = d === "count" ? `` : `d["${summary_col}"]`;
        return `${d}:d => op.${d}(${arg})${end}`;
      });
      return `.rollup({${str.join("\t")}})`;
    }
  },
  count: {
    make_input: (config) => CountInput(config),
    description: "count rows",
    type: "core",
    get_syntax: () => `.count()`
  },
  sample: {
    make_input: (config) => SampleInput(config),
    description: "retrieve random rows",
    type: "core",
    get_default_value: () => [10, ""],
    get_syntax: (d) => {
      const [n_sample, replacement] = d.value;
      const end = replacement === "replacement" ? ", {replace:true})" : ")";
      return `.sample(${n_sample}${end}`;
    }
  },
  slice: {
    make_input: (config) => SliceInput(config),
    description: "retrieve rows by index",
    type: "core",
    get_default_value: () => [0, 10],
    get_syntax: (d) => {
      const [lower, upper] = d.value;
      return `.slice(${lower}, ${upper})`;
    }
  },

  relocate: {
    make_input: (config) => RelocateInput(config),
    description: "move a column",
    type: "core",
    get_default_value: (cols) => [cols[0].label, "after", cols[1].label],
    get_syntax: (d) => {
      const [selected, position, reference] = d.value;
      return `.relocate("${selected}", {${position}:"${reference}"})`;
    }
  },
  reify: {
    make_input: (config) => ReifyInput(config),
    description: "materialize the table",
    type: "core",
    get_syntax: () => `.reify()`
  },
  ungroup: {
    make_input: (config) => UngroupInput(config),
    description: "remove groupings from data",
    type: "core",
    get_syntax: () => `.ungroup()`
  },
  unorder: {
    make_input: (config) => UnorderInput(config),
    description: "remove orderings from data",
    type: "core",
    get_syntax: () => `.unorder()`
  },
  join: {
    make_input: (config) => JoinInput(config),
    description: "join two tables",
    type: "join",
    get_default_value: (cols) => [cols[0][0]?.label, cols[1][0]?.label],
    get_syntax: (d) => {
      const [left_col, right_col] = d.value;
      return `.${d.type}(aq.from(data2), ["${left_col}", "${right_col}"])`;
    }
  },
  join_left: {
    make_input: (config) => JoinInput(config),
    description: "left join two tables",
    type: "join",
    get_default_value: (cols) => [cols[0][0]?.label, cols[1][0]?.label],
    get_syntax: (d) => {
      const [left_col, right_col] = d.value;
      return `.${d.type}(aq.from(data2), ["${left_col}", "${right_col}"])`;
    }
  },
  join_right: {
    make_input: (config) => JoinInput(config),
    description: "right join two tables",
    type: "join",
    get_default_value: (cols) => [cols[0][0]?.label, cols[1][0]?.label],
    get_syntax: (d) => {
      const [left_col, right_col] = d.value;
      return `.${d.type}(aq.from(data2), ["${left_col}", "${right_col}"])`;
    }
  },
  join_full: {
    make_input: (config) => JoinInput(config),
    description: "full join two tables",
    type: "join",
    get_default_value: (cols) => [cols[0][0]?.label, cols[1][0]?.label],
    get_syntax: (d) => {
      const [left_col, right_col] = d.value;
      return `.${d.type}(aq.from(data2), ["${left_col}", "${right_col}"])`;
    }
  },
  semijoin: {
    make_input: (config) => JoinInput(config),
    description: "return matching left rows",
    type: "join",
    get_default_value: (cols) => [cols[0][0]?.label, cols[1][0]?.label],
    get_syntax: (d) => {
      const [left_col, right_col] = d.value;
      return `.${d.type}(aq.from(data2), ["${left_col}", "${right_col}"])`;
    }
  },
  antijoin: {
    make_input: (config) => JoinInput(config),
    description: "return rows not in right table",
    type: "join",
    get_default_value: (cols) => [cols[0][0]?.label, cols[1][0]?.label],
    get_syntax: (d) => {
      const [left_col, right_col] = d.value;
      return `.${d.type}(aq.from(data2), ["${left_col}", "${right_col}"])`;
    }
  },
  fold: {
    make_input: (config) => FoldInput(config),
    description: "transform into key-value pairs",
    type: "reshape",
    get_syntax: (d) => {
      const fold_cols = d.value;
      // Wrap in quotes
      const fold_quoted = d.value.map((d) => `'${d}'`).join(",");
      if (!fold_quoted) return;
      return d.value.length > 1
        ? `.fold([${fold_quoted}])`
        : `.fold(${fold_quoted})`;
    }
  },

  pivot: {
    make_input: (config) => PivotInput(config),
    description: "create new columns for keys",
    type: "reshape",
    get_syntax: (d) => {
      const [key_col, value_col] = d.value;
      return `.pivot("${key_col}", "${value_col}")`;
    }
  },
  spread: {
    make_input: (config) => SpreadInput(config),
    description: "separate column of arrays",
    type: "reshape",
    get_syntax: (d) => `.spread("${d.value}")`
  },
  unroll: {
    make_input: (config) => UnrollInput(config),
    description: "separate array column (rows)",
    type: "reshape",
    get_syntax: (d) => `.unroll("${d.value}")`
  },
  dedupe: {
    make_input: (config) => DedupeInput(config),
    description: "remove duplicate rows",
    type: "clean",
    get_syntax: (d) => {
      if (!d.value) return "";
      // Wrap in quotes
      const deduplicate_values = d.value.map((d) => `'${d}'`).join(",");
      return `.dedupe(${deduplicate_values})`;
    }
  },
  impute: {
    make_input: (config) => ImputeInput(config),
    description: "fill in missing values",
    type: "clean",
    get_default_value: (cols) => [
      cols.filter((d) => d.type === "continuous")[0].label,
      "mean"
    ],
    get_syntax: (d) => {
      const [impute_col, operation] = d.value;
      const [quoted_name, col_ref] = impute_col.includes(" ")
        ? [`"${impute_col}"`, `["${impute_col}"]`]
        : [impute_col, `.${impute_col}`];
      return `.impute({${quoted_name}: d => op.${operation}(d${col_ref})})`;
    }
  },

  concat: {
    make_input: (config) => SetInput(config),
    description: "append a second table",
    type: "set",
    get_syntax: (d) => `.${d.type}(aq.from(data2))`
  },

  union: {
    make_input: (config) => SetInput(config),
    description: "concat and remove duplicates",
    type: "set",
    get_syntax: (d) => `.${d.type}(aq.from(data2))`
  },

  intersect: {
    make_input: (config) => SetInput(config),
    description: "keep only matching rows",
    type: "set",
    get_syntax: (d) => `.${d.type}(aq.from(data2))`
  },
  except: {
    make_input: (config) => SetInput(config),
    description: "Compute table set difference",
    type: "set",
    get_syntax: (d) => `.${d.type}(aq.from(data2))`
  }
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Inputs`
)});
  main.variable(observer("SliceInput")).define("SliceInput", ["html"], function(html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const lower = html`<input name=lower class="inline-small" type="number" value=${
    value[0] || 0
  } placeholder="start index"/>`;
  const upper = html`<input name=upper class="inline-small" type="number" value=${
    value[1] || 10
  }  placeholder="end index"/>`;
  const form = html`<form id=${id}>Slice: Retrieve rows between
    ${lower}
    and
    ${upper}
</form>`;
  form.oninput = (event) => {
    // Update the value
    form.value = [form.lower.value, form.upper.value];
  };
  form.oninput({});
  return form;
}
)});
  main.variable(observer("FilterInput")).define("FilterInput", ["html","make_select","d3"], function(html,make_select,d3){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  // Get column types
  let col_data = cols;

  if (col_data.length === 0)
    return html`<div class="warning"><code>filter</code> not possible: there are no categorical or continuous columns present</div>`;

  const type_map = new Map(col_data.map((d) => [d.label, d.type]));

  const select = make_select(
    "filter_col",
    col_data.map((d) => d.label),
    value[0]
  );

  // Comparison operation (e.g., equal, not equal, etc.)
  const comparisonOptions = {
    categorical: [
      { label: "matches", value: "match" },
      { label: "starts with", value: "startswith" },
      { label: "ends with", value: "endswith" },
      { label: "is equal to", value: "equal" },
      { label: "is *not* equal to", value: "not_equal" }
    ],
    continuous: [
      { label: "is less than", value: "lt" },
      { label: "is greater than", value: "gt" }
    ],
    date: [
      { label: "is less than", value: "lt" },
      { label: "is greater than", value: "gt" }
    ]
  };

  // Element for selecting comparison type
  const buildComparison = (type) => {
    return make_select("comparison", comparisonOptions[type], value[1]);
  };

  const comparison = buildComparison(type_map.get(value[0]));

  const buildComparisonValue = (col) => {
    const type = type_map.get(col);
    let ele;
    switch (type) {
      case "categorical":
        const inputVal = typeof value[2] === "string" ? value[2] : ""
        ele = html`<input value="${
          inputVal || ""
        }" name=comparisonValue class="inline" placeholder="Type a value here"/>`;
        break;
      case "date":
      case "continuous":
        const min = d3.min(options.data, (d) => +d[col]);
        const max = d3.max(options.data, (d) => +d[col]);
        ele = html`<input value="${
          value[2] || ""
        }" min=${min} max=${max} name=comparisonValue type="range" />`;
        break;
    }
    return ele;
  };
  const comparisonValue = buildComparisonValue(value[0]);
  const filterForm = html`<form id=${id}>Filter rows:
    ${select}
    ${comparison}
    ${comparisonValue}
</form>`;

  filterForm.oninput = (event) => {
    if (event.target && event.target.name === "filter_col") {
      // Rebuild the other options
      const new_col = filterForm.filter_col.value;
      const type = type_map.get(new_col);
      const new_comparison = buildComparison(type);
      const new_comparison_value = buildComparisonValue(new_col);
      filterForm.comparison.parentNode.replaceChild(
        new_comparison,
        filterForm.comparison
      );
      filterForm.comparisonValue.parentNode.replaceChild(
        new_comparison_value,
        filterForm.comparisonValue
      );
    }

    // Update the value
    filterForm.value = [
      filterForm.filter_col.value,
      filterForm.comparison.value,
      filterForm.comparisonValue.value
    ];
  };
  filterForm.oninput({});
  return filterForm;
}
)});
  main.variable(observer("SampleInput")).define("SampleInput", ["html","make_checkboxes"], function(html,make_checkboxes){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const ele = html`<input name=n_sample class="inline-small" type="number" placeholder="# of rows" value=${
    value[0] || 10
  } />`;
  const order_value = value[1] ? "With Replacement" : "";
  const order = make_checkboxes(
    "replacement",
    ["With Replacement"],
    [order_value]
  );
  const form = html`<form id=${id}>Sample Rows:
    ${ele}
    ${order}
</form>`;
  form.oninput = (event) => {
    const replacement = form.replacement.checked === true ? "replacement" : "";
    // Update the value    
    form.value = [form.n_sample.value, replacement];    
  };
  form.oninput({});
  return form;
}
)});
  main.variable(observer("DeriveInput")).define("DeriveInput", ["html"], function(html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const ele = html`<input name=col_name class="inline" placeholder="New column name" value="
${
  value[0] || ""
}" /><span>is defined as</span><input name=col_value class="inline" placeholder="try: COLUMN + 5" value="${
    value[1] || ""
  }" 
/>`;

  const form = html`<form id=${id}>Derive:
    ${ele}
</form>`;
  form.oninput = (event) => {
    // Update the value
    form.value = [form.col_name.value, form.col_value.value];
  };
  form.oninput({});
  return form;
}
)});
  main.variable(observer("FoldInput")).define("FoldInput", ["make_checkboxes","html"], function(make_checkboxes,html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const labels = cols.map((d) => d.label);
  const checkboxes = make_checkboxes("select", labels, value);
  const form = html`<form id=${id}>Fold columns:
${checkboxes}
</form>`;
  form.oninput = () =>
    (form.value = Object.keys(form.select)
      .filter((d) => form.select[d].checked === true)
      .map((d) => form.select[d].value));

  form.oninput();
  return form;
}
)});
  main.variable(observer("JoinInput")).define("JoinInput", ["make_select","capitalize","html"], function(make_select,capitalize,html){return(
({
  id = "",
  type = "",
  cols = [],
  value = [],
  options = {}
} = {}) => {
  const left_labels = cols[0].map((d) => d.label);
  const left_select = make_select("left_col", left_labels, value[0]);
  const right_labels = cols[1].map((d) => d.label);
  const right_select = make_select("right_col", right_labels, value[1]);

  // Join data input
  const label =
    type.includes("semi") || type.includes("anti")
      ? `${capitalize(type.replace("join", ""))} Join`
      : type.includes("join_")
      ? `Join ${type.replace("join_", "")}`
      : "Join";
  const form = html`<form id=${id}>${label}
    <code>data2</code>
    on:
    left column ${left_select} matches right column ${right_select}
</form>`;

  // Event handling
  form.oninput = () => {
    form.value = [form.left_col.value, form.right_col.value];
  };
  form.oninput();
  return form;
}
)});
  main.variable(observer("SpreadInput")).define("SpreadInput", ["make_select","html"], function(make_select,html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const categories = cols
    .filter((d) => d.type === "categorical")
    .map((d) => d.label);
  const col_input = make_select("col", categories, value);
  const form = html`<form id=${id}>Spread: ${col_input}</form>`;

  form.oninput = () => {
    form.value = form.col.value;
  };

  form.oninput();
  return form;
}
)});
  main.variable(observer("UnrollInput")).define("UnrollInput", ["make_select","html"], function(make_select,html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const categories = cols
    .filter((d) => d.type === "categorical")
    .map((d) => d.label);
  const col_input = make_select("col", categories);

  const form = html`<form id=${id}>Unroll: ${col_input}</form>`;

  form.oninput = () => {
    form.value = form.col.value;
  };

  form.oninput();
  return form;
}
)});
  main.variable(observer("PivotInput")).define("PivotInput", ["make_select","html"], function(make_select,html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const categories = cols
    .filter((d) => d.type === "categorical" || d.type === "date")
    .map((d) => d.label);
  const key_input = make_select("key_col", categories, value[0]);
  const value_input = make_select(
    "value_col",
    cols.map((d) => d.label),
    value[1]
  );
  const form = html`<form id=${id}>Pivot: ${key_input} ${value_input}</form>`;

  form.oninput = () => {
    form.value = [form.key_col.value, form.value_col.value];
  };
  form.oninput();
  return form;
}
)});
  main.variable(observer("ImputeInput")).define("ImputeInput", ["make_select","html"], function(make_select,html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const col_input = make_select(
    "col",
    cols.filter((d) => d.type === "continuous").map((d) => d.label),
    value[0]
  );
  const operations = ["max", "mean", "median", "min", "mode"];
  const ele = make_select("operation", operations, value[1]);
  const form = html`<form id=${id}>Impute:${col_input} using the column ${ele}
</form>`;
  form.oninput = () => {
    form.value = [form.col.value, form.operation.value];
  };
  form.oninput();
  return form;
}
)});
  main.variable(observer("RenameInput")).define("RenameInput", ["make_select","html"], function(make_select,html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const labels = cols.map((d) => d.label);
  const select = make_select("col", labels, [value[0]]);
  const new_label = html`<input name=new_label class="inline" placeholder="New column name" value="${
    value[1] || ""
  }"/>`;
  const form = html`<form id=${id}>Rename:
${select}
to 
${new_label}
</form>`;
  form.oninput = () => {
    form.value = [form.col.value, form.new_label.value];
  };
  form.oninput();
  return form;
}
)});
  main.variable(observer("RelocateInput")).define("RelocateInput", ["make_select","html"], function(make_select,html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const labels = cols.map((d) => d.label);
  const selected = make_select("selected", labels, value[0]);
  const position = make_select("position", ["after", "before"], value[1]);
  const reference = make_select("reference", labels, value[2]);
  const new_label = html`<input name=new_label class="inline" placeholder="New column name"/>`;
  const form = html`<form id=${id}>Relocate:
${selected}
${position}
${reference}
</form>`;
  form.oninput = () => {
    form.value = [
      form.selected.value,
      form.position.value,
      form.reference.value
    ];
  };
  form.oninput();
  return form;
}
)});
  main.variable(observer("OrderbyInput")).define("OrderbyInput", ["make_select","make_checkboxes","html"], function(make_select,make_checkboxes,html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const labels = cols.map((d) => d.label);
  const select = make_select("col", labels, value[0]);
  const order = make_checkboxes("order", ["Descending"], [value[1]]);
  const form = html`<form id=${id}>Order by (sort):
${select}
${order}
</form>`;
  form.oninput = () => {
    const order = form.order.checked === true ? "Descending" : "ascending";
    form.value = [form.col.value, order];
  };
  form.oninput();
  return form;
}
)});
  main.variable(observer("RollupInput")).define("RollupInput", ["make_select","make_checkboxes","html"], function(make_select,make_checkboxes,html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const summarizers = cols
    .filter((d) => d.type === "continuous")
    .map((d) => d.label);
  const defaults = value[1] || ["count", "mean"];
  const select =
    cols.length === 0 ? "" : make_select("col", summarizers, [value[0]]);
  const summarize_options =
    summarizers.length === 0
      ? ["count"]
      : ["min", "max", "mean", "median", "sum", "stdev", "count"];
  const metrics = make_checkboxes("metric", summarize_options, defaults);

  const form = html`<form id=${id}>Rollup:
${select}
${metrics}
</form>`;
  form.oninput = () => {
    const checked = !Object.keys(form.metric).length
      ? form.metric.checked
        ? [form.metric.value]
        : ""
      : Object.keys(form.metric)
          .filter((d) => form.metric[d].checked === true)
          .map((d) => form.metric[d].value);

    const value = cols.length === 0 ? "" : form.col.value;
    form.value = [value, checked];
  };
  form.oninput();
  return form;
}
)});
  main.variable(observer("GroupbyInput")).define("GroupbyInput", ["html","make_checkboxes"], function(html,make_checkboxes){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const groups = cols
    .filter((d) => d.type === "categorical" || d.type === "date")
    .map((d) => d.label);
  if (groups.length === 0)
    return html`<div class="warning"><code>groupby</code> not possible: there are no categorical or date columns present</div>`;

  const checkboxes = make_checkboxes("groups", groups, value);
  const form = html`<form id=${id}>Group by:
${checkboxes}
</form>`;
  form.oninput = () => {
    if (!form.groups) return;
    const checked = !Object.keys(form.groups).length
      ? form.groups.checked
        ? [form.groups.value]
        : ""
      : Object.keys(form.groups)
          .filter((d) => form.groups[d].checked === true)
          .map((d) => form.groups[d].value);
    form.value = checked;
  };
  form.oninput();
  return form;
}
)});
  main.variable(observer("UngroupInput")).define("UngroupInput", ["html"], function(html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const form = html`<form id=${id}>Ungroup data ✓</form>`;
  return form;
}
)});
  main.variable(observer("ReifyInput")).define("ReifyInput", ["html"], function(html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const form = html`<form id=${id}>Reify Table ✓</form>`;
  return form;
}
)});
  main.variable(observer("SetInput")).define("SetInput", ["html","capitalize"], function(html,capitalize){return(
({
  id = "",
  type = "",
  cols = [],
  value = [],
  options = {}
} = {}) => {
  const form = html`<form id=${id}>${capitalize(
    type
  )} Table <code>data2</code> ✓</form>`;
  return form;
}
)});
  main.variable(observer("CountInput")).define("CountInput", ["html"], function(html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const form = html`<form id=${id}>Count Rows ✓</form>`;
  return form;
}
)});
  main.variable(observer("UnorderInput")).define("UnorderInput", ["html"], function(html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const form = html`<form id=${id}>Unorder data ✓</form>`;
  return form;
}
)});
  main.variable(observer("SelectInput")).define("SelectInput", ["make_checkboxes","html"], function(make_checkboxes,html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const labels = cols.map((d) => d.label);
  const default_cols = value.length === 0 ? [labels[0]] : value;
  const checkboxes = make_checkboxes("select", labels, default_cols);
  const form = html`<form id=${id} >Select columns:
    ${checkboxes}
  </form>`;
  form.oninput = () =>
    (form.value = Object.keys(form.select)
      .filter((d) => form.select[d].checked === true)
      .map((d) => form.select[d].value));

  form.oninput();
  return form;
}
)});
  main.variable(observer("DedupeInput")).define("DedupeInput", ["make_checkboxes","html"], function(make_checkboxes,html){return(
({ id = "", cols = [], value = [], options = {} } = {}) => {
  const labels = cols.map((d) => d.label);
  const checkboxes = make_checkboxes("select", labels, value);
  const form = html`<form id=${id}>Remove Duplicates:
${checkboxes}
</form>`;
  form.oninput = () =>
    (form.value = Object.keys(form.select)
      .filter((d) => form.select[d].checked === true)
      .map((d) => form.select[d].value));

  form.oninput();
  return form;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Helper Functions`
)});
  main.variable(observer("display_error")).define("display_error", ["html"], function(html){return(
(err) => {
  let message = "";
  switch (true) {
    case err.message.includes("column"):
      message =
        "Your code statement is no longer valid, as it references a column that doesn't exist. This is often the result of reordering your operations, or changing a select statement. Undoing your previous operation should resolve the issue.";
      break;
    case err.message.includes("Unexpected token"):
      message =
        "Your code statement is not valid (yet). You may simply need to fill in the options above.";
      break;
    case err.message.includes("results"):
      message =
        "Make sure to pass an array of objects to the Wrangler() function.";
      break;
    default:
      message = "You encountered an error: ";
      break;
  }

  const styles = `
    background-color:#caeaf985;
    padding: 10px;
    border-radius:5px;
  `;

  return html`<div style="${styles}">${message}
  <pre style="color:red;">     ${err.message}
  </pre>
</div>`;
}
)});
  main.variable(observer("get_code_expression")).define("get_code_expression", ["operations"], function(operations){return(
(inputs) => {
  let expression = `aq.from(data)`;
  if (!inputs?.length) return expression;
  inputs.map((d, i) => {
    const next_line = operations[d.type].get_syntax(d);
    if (!next_line) return;
    expression += "\n\t" + operations[d.type].get_syntax(d);
  });
  return expression;
}
)});
  main.variable(observer("make_select")).define("make_select", ["html"], function(html){return(
(name = "select", options = ["a", "b"], selected = "") => {
  return html`<label>
      <select name="${name}">
        ${options.map(
          (d) =>
            html`<option ${
              d === selected || d.value === selected ? "selected" : ""
            } value="${d.value || d}">${d.label || d}</option>`
        )}
      </select>
    </label>`;
}
)});
  main.variable(observer("make_checkboxes")).define("make_checkboxes", ["html"], function(html){return(
(name = "boxes", options = ["a", "b"], selected = []) => {
  return html`${options.map((d) => {
    return `<label style="margin-right:5px; font-size:13px; display: inline-block;"><input type="checkbox" name="${name}" value="${d}" ${
      selected.includes(d) ? "checked" : ""
    }/>${d}</label>`;
  })}
`;
}
)});
  main.variable(observer("get_cols")).define("get_cols", ["getType"], function(getType){return(
(data) =>
  Object.keys(data[0] || {}).map((d) => {
    return {
      label: d,
      type: getType(data, d)
    };
  })
)});
  main.variable(observer("copy_code_button")).define("copy_code_button", ["html","Copier","make_copy_icon"], function(html,Copier,make_copy_icon){return(
(code_str) => {
  return html`<div class="copier_wrapper">${Copier(
    html`${make_copy_icon()}<span style="vertical-align:top;">Copy</span>`,
    { value: code_str }
  )}</div>`;
}
)});
  main.variable(observer("getType")).define("getType", function(){return(
(data, column) => {
  for (const d of data) {
    const value = d[column];
    if (value == null) continue;
    if (typeof value === "number") return "continuous";
    if (value instanceof Date) return "date";
    return "categorical";
  }
}
)});
  main.variable(observer("prefixVarsInFormula")).define("prefixVarsInFormula", ["P"], function(P){return(
function prefixVarsInFormula(str, arg = "d", ignore = ["aq", "op"]) {
  let shift = 0;
  const insert = `${arg}.`;
  for (const { type, start, end, name } of P.parseCell(str).references) {
    if (type === "Identifier" && name !== arg && !ignore.includes(name)) {
      str =
        str.slice(0, start + shift) + insert + name + str.slice(end + shift);
      shift += insert.length;
    }
  }
  return str;
}
)});
  main.variable(observer("evaluate")).define("evaluate", function(){return(
(s, obj) =>
  new Function(...Object.keys(obj), s)(...Object.values(obj))
)});
  main.variable(observer("id_generator")).define("id_generator", function(){return(
() => {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return "a" + S4() + S4();
}
)});
  main.variable(observer("format_code")).define("format_code", ["html","md"], function(html,md){return(
(code_str) => {
  return html`<div class="code_display" style="background-color:#FBF8F0; padding:10px; border-radius:5px;position:relative;width:100%;">${md`~~~js
${code_str}
~~~`}`;
}
)});
  main.variable(observer("capitalize")).define("capitalize", function(){return(
(string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Styles`
)});
  main.variable(observer("make_styles")).define("make_styles", ["html"], function(html){return(
() => html`<style>
  input.inline, input.inline:focus {
   width: auto !important;
   min-width:0px;
   border-top:none !important;
   border-left:none;
   border-right:none;
   text-align:center;
 }
  input.inline:focus {
    outline-width: 0;
  } 
  .inline-small {
    width:75px !important;
  }

  input.inline-large, input.inline-large:focus {
    width:171px !important;
  }
  
  form {
    display:inline;
  }

  .icon_menu_wrapper:hover {
    border:1px solid black;
  } 
  .icon_menu_wrapper {
    border:1px solid white;
    cursor:pointer;
    margin:0px;
    padding-bottom:5px;
    height:40px;
  } 

  .right_panel {
    display:inline-block; 
    vertical-align:top;
    padding-left:20px;
    flex:1;
    border-left:1px solid #d3d3d3;
  }
  .section_header {
    font-size:20px;
    font-weight:300;
    border-bottom: 1px solid #d3d3d3;
  }

  .section_header a {
    font-size:15px;
    vertical-align:top;
  }
  .wrangler {
    user-select: none;
    font-family:var(--sans-serif);
  }

  .docs_link {
    font-weight: 600;
    color: #3056b2;
    float: right;
    line-height: 2;
    padding-right: 21px;
  }
  .docs_link a {
    color: #3056b2;
  }
  .copier_wrapper button {
    background-color:#3056b2;
    border-radius:5px;
    color:white;
    cursor:pointer;
    font-weight:700;
  }

  .copier_wrapper {  
    display:inline-block;
  }

  pre {
    margin:0px;
  }

  .code_wrapper {
    border-top:1px solid #d3d3d3;
    padding-top:10px;
  }

  .event_form {
    width:100%;
    height:100%;
    position:relative;
  }
  .prompt_action {
    background-color:#f7f5f5;
    height:calc(100% - 20px);
    margin-top: 10px;
    border-radius:5px;
    display: flex;
    justify-content: center; /* align horizontal */
    align-items: center; /* align vertical */
    color:#7892de;
  }

  .icon_menu_wrapper svg {
    margin:3px;
  }

  .icon_info {
    margin-top:0px; 
    font:16px system-ui,sans-serif;
    display:inline-block; 
    white-space:pre-line;
    line-height:8px;
    height:40px;      
    vertical-align:top; 
    width:176px;
  }
  .type_info {
    padding:3px; 
    color:#6f6e6e;
    display:inline-block;
    margin-left:10px;
    margin-right:5px;
    border-radius:5px;
    background-color:#e4f2f7;
  }

  .copy_instructions, .copy_instructions code {
    font-size:11px;
  }

  .code_wrapper div                                                                {
    display:inline-block;
    box-sizing:border-box;
  }
  .copier_wrapper > form {
    display: inline-block !important;
    width: auto;
  }

  .copier_wrapper {
    padding-left:15px;
  }

  .remove {
    display: inline;
    color: darkgrey;
    cursor: pointer;
    position: absolute;
    right: 10px;
    font-weight:600;
    z-index:9999999;
  }
  .code_instructions {
    font-size:12px;    
    float: right;
  }

  .wrangler_container {
    display:flex;
    flex-direction:row;
  }

  .content {
    position:relative;
  }
  .left_panel {
    display:inline-block; 
    padding-bottom:5px;
    padding-bottom: 10px;
    width: 250px;
    min-width: 250px;
    
  }
  .menu_wrapper {
    max-height: 368px;
    overflow-y: scroll;
  }
  .hide_large {
    display:none;
  }

  .warning {
    background-color:#ffa5004d;
    margin-right:10px;
    border-radius:5px;
  }

  .docs_link {
    display:flex;
    vertical-align:bottom;
    padding-top:6px;
  }

  /* temp fix to hide selection column */
  .wrangler table tr td:first-child { visibility: hidden; }
  .wrangler table tr th:first-child { width: 0; }
  .wrangler table tr th:first-child input { visibility: hidden; }

 .clear_button {
    display: inline-block;
    border: 1px solid black;
    padding-left: 3px;
    padding-right: 3px;
    border-radius: 10px;
    margin-top: 20px;
    position: absolute;
    bottom: 10px;
    cursor:pointer;
    font-size: 12px;
  }
  /* Media queries */ 
  @media (max-width: 756px) {
    .wrangler_container {
      flex-direction:column;
    }
    .right_panel {
      display:block;
      padding-left:0px;
      border-left:none;
    }
    .left_panel {
      display:block;
      width:100%;
    }
    .hide_large {
      display:inherit;
    }

    .hide_small {
      display:none;
    }
  }

 
  </style>`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Icons`
)});
  main.variable(observer("make_hamburger_icon")).define("make_hamburger_icon", function(){return(
() => {
  return `<svg width="16" height="16" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1" y="2" width="14" height="2" rx="0.7" fill="black"/>
<rect x="1" y="7" width="14" height="2" rx="0.7" fill="black"/>
<rect x="1" y="12" width="14" height="2" rx="0.7" fill="black"/>
</svg>`;
}
)});
  main.variable(observer("make_docs_icon")).define("make_docs_icon", ["svg"], function(svg){return(
() => svg`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.2 1.5L3.5 1.5C2.94772 1.5 2.5 1.94772 2.5 2.5L2.5 13.5C2.5 14.0523 2.94772 14.5 3.5 14.5L12.5 14.5C13.0523 14.5 13.5 14.0523 13.5 13.5L13.5 4.75M10.2 1.5L13.5 4.75M10.2 1.5L10.2 4.75L13.5 4.75" stroke="#3056b2" stroke-width="2"/>
<line x1="5.5" y1="10.5" x2="10.5" y2="10.5" stroke="#3056b2" stroke-width="2"/>
<line x1="5.5" y1="7.5" x2="9.5" y2="7.5" stroke="#3056b2" stroke-width="2"/>
</svg>`
)});
  main.variable(observer("make_copy_icon")).define("make_copy_icon", ["svg"], function(svg){return(
() => svg`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 9V5.89453C2 5.34225 2.44772 4.89453 3 4.89453H10C10.5523 4.89453 11 5.34225 11 5.89453V13.8945C11 14.4468 10.5523 14.8945 10 14.8945H8" stroke="white" stroke-width="2"/>
<line x1="4" y1="10" x2="4" y2="16" stroke="white" stroke-width="2"/>
<path d="M5 3L5 2.00001L12 2C13.1046 2 14 2.89543 14 4V12H13" stroke="white" stroke-width="2" stroke-linejoin="round"/>
<line x1="7" y1="13" x2="1" y2="13" stroke="white" stroke-width="2"/>
</svg>
`
)});
  main.variable(observer("icons")).define("icons", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("icons@4.json").json()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Appendix`
)});
  const child1 = runtime.module(define1);
  main.import("Copier", child1);
  const child2 = runtime.module(define2);
  main.import("op", child2);
  const child3 = runtime.module(define3);
  main.import("dataInput", child3);
  main.variable(observer("P")).define("P", ["require"], function(require){return(
require("@observablehq/parser@4.4.4")
)});
  return main;
}

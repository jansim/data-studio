// https://observablehq.com/@jansim/minimal-datawrangler-wrapper@53
import define1 from "./6dcf44d762a0599e@4192.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const child1 = runtime.module(define1);
  main.import("Wrangler", child1);
  main.import("op", child1);
  main.variable(observer("data1")).define("data1", function(){return(
[
  {row: 1, name: "A"},
  {row: 2, name: "B"}
]
)});
  main.variable(observer("data2")).define("data2", function(){return(
undefined
)});
  main.variable(observer("viewof output")).define("viewof output", ["Wrangler","data1","data2"], function(Wrangler,data1,data2){return(
Wrangler(data1, data2)
)});
  main.variable(observer("output")).define("output", ["Generators", "viewof output"], (G, _) => G.input(_));
  main.variable(observer("output_data")).define("output_data", ["output"], function(output){return(
output.data
)});
  main.variable(observer("output_code")).define("output_code", ["output"], function(output){return(
output.code
)});
  return main;
}

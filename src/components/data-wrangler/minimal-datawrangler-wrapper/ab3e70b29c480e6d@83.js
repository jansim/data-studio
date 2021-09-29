// https://observablehq.com/@mbostock/copier@83
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md","Copier"], function(md,Copier){return(
md`# Copier

<p style="background: #fffced; box-sizing: border-box; padding: 10px 20px;">***Update Sep. 2021:*** *Buttons are now available as part of [**Observable Inputs**](/@observablehq/inputs), and you can use <code>navigator.clipboard.writeText</code> to copy text to the clipboard! This notebook will remain for history, but please upgrade.*</p>

A button to help copy snippets of text to the clipboard. To use in your notebook:

~~~js
import {Copier} from "@mbostock/copier"
~~~

${Copier("Copy import", {value: `import {Copier} from "@mbostock/copier"`})}`
)});
  main.variable(observer()).define(["Inputs"], function(Inputs){return(
Inputs.textarea({placeholder: "Now try pasting here."})
)});
  main.variable(observer()).define(["Copier"], function(Copier){return(
Copier("Click me!", {value: "Hello, world!"})
)});
  main.variable(observer()).define(["Copier"], function(Copier){return(
Copier([
  ["1", "I have eaten the plums that were in the icebox"],
  ["2", "and which you were probably saving for breakfast"],
  ["3", "Forgive me they were delicious so sweet and so cold"]
], {label: "Snippets"})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---

## Implementation`
)});
  main.variable(observer()).define(["html","pbcopy"], function(html,pbcopy)
{
  let count = 0;
  return Object.assign(
    html`<button>Click me to copy text!`,
    {onclick: () => pbcopy(`Hello, world! ${++count}`)}
  );
}
);
  main.variable(observer("pbcopy")).define("pbcopy", function(){return(
text => navigator.clipboard.writeText(text)
)});
  main.variable(observer("Copier")).define("Copier", ["pbcopy","Inputs"], function(pbcopy,Inputs){return(
function Copier(content = "Copy code", options) {
  if (Array.isArray(content)) content = Array.from(content, ([key, value]) => [key, () => (pbcopy(value), value)]);
  return Inputs.button(content, {...options, reduce: (value) => (pbcopy(value), value)});
}
)});
  main.variable(observer("copy")).define("copy", ["pbcopy"], function(pbcopy){return(
pbcopy
)});
  return main;
}

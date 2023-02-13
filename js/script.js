const AlertMsg = {
  pending: '<span style="color: red">Pending</span>',
  copied: '<span style="color: blue">Copied</span>',
};

{
  document.getElementById("textarea-1").oninput = refresh;
  document.getElementById("option-2").oninput = refresh;

  refresh();

  document.getElementById("textarea-3").oninput = fillDiv3;

  function refresh() {
    var code;

    const { value: divider } = document.getElementById("option-2"),
      dividerCode = parseInt(divider.split(" - ")[1]);

    console.log(divider, dividerCode);

    const { value } = document.getElementById("textarea-1");

    const converted = [...value].map((char, i) => {
      code = char.charCodeAt();

      if (code === dividerCode) {
        console.log(`Found dividerCode ${dividerCode} at ${i}`);
        return "\t";
      }

      return char;
    });

    document.getElementById("textarea-3").value = converted.join("");
    document.getElementById("p-3").innerHTML = AlertMsg.pending;

    fillDiv3();
  }
}

{
  console.log(ClipboardJS);
  const clipboard = new ClipboardJS("#btn-3");

  clipboard.on("success", function (e) {
    console.log("---------------------");
    console.info("Action:", e.action);
    console.info("Text:", e.text);
    console.info("Trigger:", e.trigger);

    e.clearSelection();

    document.getElementById("p-3").innerHTML = AlertMsg.copied;
  });

  clipboard.on("error", function (e) {
    console.log("*********************");
    console.error("Action:", e.action);
    console.error("Trigger:", e.trigger);
  });
}

function fillDiv3() {
  const divId = "div-3",
    { value } = document.getElementById("textarea-3");

  document.getElementById(divId).innerHTML = "";

  const data = value.split("\n");

  const header = d3
    .select("#" + divId)
    .append("div")
    .append("div")
    .attr("class", "flex");

  var maxI = 0;
  d3.select("#" + divId)
    .select("div")
    .append("div")
    .selectAll("div")
    .data(data)
    .enter()
    .append("div")
    .attr("class", "flex")
    .selectAll("p")
    .data((d, i) => ["" + i].concat(d.split("\t")))
    .enter()
    .append("p")
    .attr("class", (d, i) => (i > 0 ? "value" : "value ruler"))
    .attr("style", (d, i) => {
      if (i > maxI) maxI = i;
      return "background: " + d3.schemeCategory10[i % 10] + "50";
    })
    .text((d) => {
      return d ? d : "[!empty]";
    });

  console.log(maxI);

  header
    .selectAll("p")
    .data([...new Array(maxI + 1)])
    .enter()
    .append("p")
    .attr("class", "header ruler")
    .attr("style", (d, i) => {
      return "background: " + d3.schemeCategory10[i % 10] + "50";
    })
    .text((d, i) => (i > 0 ? "Col: " + i : "Idx"));
}
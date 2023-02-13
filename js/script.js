const AlertMsg = {
  pending: '<span style="color: red">Pending</span>',
  copied: '<span style="color: blue">Copied</span>',
};

{
  document.getElementById("textarea-1").oninput = refresh;
  document.getElementById("option-2").oninput = refresh;

  refresh();

  document.getElementById("textarea-3").oninput = fillDiv3;

  /**
   * Fetch the value from #textarea-1.
   * Fetch the option from #option-2.
   * Parse the value, convert it into the \t divided content and update the #textarea-3 and #p-3
   */
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

    // Remove the repeated divider if it is space,
    // since the space is invisible and the connected space usually refers the single divider.
    document.getElementById("textarea-3").value = (
      dividerCode === 32 ? removeRepeat(converted) : converted
    ).join("");

    fillDiv3();
  }

  /**
   * Remove repeated \t from the charArray
   * @param {Array} charArray
   * @returns Converted Array
   */
  function removeRepeat(charArray) {
    return charArray.map((char, i) => {
      if (i === 0) return char;
      if (char === "\t" && charArray[i - 1] === "\t") return "";
      return char;
    });
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

/**
 * Fill the #div-3.
 * It is the table-like version of the #textarea-3
 */
function fillDiv3() {
  document.getElementById("p-3").innerHTML = AlertMsg.pending;
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

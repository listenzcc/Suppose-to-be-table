const ncp = require("copy-paste");

ncp.paste((d, content) => {
  console.log("content");
  console.log(content);
  console.log(typeof content);
  console.log(content.length);

  [...content].map((char, i) => {
    console.log(">>", i, "    ", char.charCodeAt(), char);
  });
});

import fs from "fs";

const vars = JSON.parse(fs.readFileSync("src/styles/variables.json", "utf8"));
const scssContent =
  ":root {\n" +
  Object.entries(vars)
    .map(([key, value]) => {
      const cssName = "--" + key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
      /* const formatted = typeof value === "number" ? `${value}ms` : value;
      return `  ${cssName}: ${formatted};`; */
      return `  ${cssName}: ${value};`;
    })
    .join("\n") +
  "\n}\n";

fs.writeFileSync("src/styles/_generated-vars.scss", scssContent);
console.log("✅ Fichier SCSS généré : src/styles/_generated-vars.scss");

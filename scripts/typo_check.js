import fs from "fs";
import path from "path";

const walk = dir =>
  fs.readdirSync(dir).flatMap(f => {
    const p = path.join(dir, f);
    return fs.statSync(p).isDirectory() ? walk(p) : [p];
  });

const files = walk(".");

const typos = ["teh", "recieve", "adress", "occured"];

let found = false;

for (const file of files) {
  if (!file.endsWith(".md") && !file.endsWith(".txt") && !file.endsWith(".js")) continue;

  const content = fs.readFileSync(file, "utf8");

  for (const typo of typos) {
    if (content.includes(typo)) {
      console.error(`Typo found in ${file}: "${typo}"`);
      found = true;
    }
  }
}

if (found) process.exit(1);

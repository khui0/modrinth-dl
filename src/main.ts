import add from "./add.ts";
import info from "./info.ts";
import init from "./init.ts";
import list from "./list.ts";
import remove from "./remove.ts";
import search from "./search.ts";
import update from "./update.ts";

const subcommands: { name: string[]; fn: () => void }[] = [
  {
    name: ["help", "h"],
    fn: help,
  },
  {
    name: ["init"],
    fn: init,
  },
  {
    name: ["list", "ls"],
    fn: list,
  },
  {
    name: ["add", "a"],
    fn: add,
  },
  {
    name: ["remove", "rm"],
    fn: remove,
  },
  {
    name: ["info"],
    fn: info,
  },
  {
    name: ["search", "s"],
    fn: search,
  },
  {
    name: ["update", "u", "install", "i"],
    fn: update,
  },
];

const selection = Deno.args[0];

if (
  subcommands
    .map((item) => item.name)
    .flat()
    .includes(selection)
) {
  subcommands.find((item) => item.name.includes(selection))?.fn();
} else {
  help();
}

function help() {
  console.log(
    "%cmodrinth-dl\n%chttps://github.com/khui0/modrinth-dl%c" +
      subcommands.map((command) => `\n  ${command.name[0]}`).join(""),
    "font-weight: bold",
    "color: gray",
    "color: unset"
  );
}

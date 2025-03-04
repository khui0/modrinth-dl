import { error } from "./console.ts";
import init from "./init.ts";
import add from "./add.ts";
import list from "./list.ts";
import remove from "./remove.ts";
import info from "./info.ts";

const subcommands: { name: string[]; fn: () => void }[] = [
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
    name: ["info", "i"],
    fn: info,
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
  error(
    "Unknown command! Try: " + subcommands.map((item) => item.name).join(", ")
  );
}

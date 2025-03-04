import { error } from "./console.ts";
import init from "./init.ts";
import add from "./add.ts";

const subcommands: { name: string[]; fn: () => void }[] = [
  {
    name: ["init"],
    fn: init,
  },
  {
    name: ["add", "a"],
    fn: add,
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

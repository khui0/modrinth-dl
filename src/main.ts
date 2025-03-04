import init from "./init.ts";
import { error } from "./console.ts";

const subcommands: { name: string; fn: () => void }[] = [
  {
    name: "init",
    fn: init,
  },
];

const selection = Deno.args[0];

if (subcommands.map((item) => item.name).includes(selection)) {
  subcommands.find((item) => item.name === selection)?.fn();
} else {
  error(
    "Unknown command! Try: " + subcommands.map((item) => item.name).join(", ")
  );
}

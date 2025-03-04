import { parseArgs } from "jsr:@std/cli/parse-args";
import { MODRINTH_LOADERS, MODRINTH_VERSIONS } from "./modrinth.ts";
import { error, success } from "./console.ts";

const args = {
  alias: {
    target: "v",
    loader: "l",
    out: "o",
  },
  string: ["version", "loader", "out"],
  default: {
    out: "./mods",
  },
};

export default () => {
  const options = parseArgs(Deno.args.slice(1), args);

  if (options.target && options.loader && options.mods && options.out) {
    // Skip UI
  } else {
    console.log(
      `This utility will create a modrinth.json file at the current directory (${Deno.cwd()})\n\nUse the 'add' command afterwards to add mods\nUse the 'update' command to download mods\nPress ^C at any time to quit\n`
    );

    const version = prompt("Version:", options.v || "")?.toLowerCase();
    if (!isValidVersion(version)) {
      error("Invalid target version!");
      return;
    }

    const loader = prompt("Loader:", options.l || "")?.toLowerCase();
    if (!isValidLoader(loader)) {
      error("Invalid target loader!");
      return;
    }

    const outDir = prompt("Output directory:", options.o || "");

    Deno.writeTextFileSync(
      "./modrinth.json",
      JSON.stringify(
        {
          version,
          loader,
          out: outDir,
          mods: [],
        },
        null,
        2
      )
    );

    success("Created a modrinth.json file!");
  }
};

function isValidVersion(target: string | null | undefined): boolean {
  if (target === null || !target) return false;
  return MODRINTH_VERSIONS.includes(target);
}

function isValidLoader(target: string | null | undefined): boolean {
  if (target === null || !target) return false;
  return MODRINTH_LOADERS.includes(target);
}

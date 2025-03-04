import { error, success, warn } from "./console.ts";
import { isProjectValid } from "./modrinth.ts";

export default async () => {
  try {
    await Deno.lstat("./modrinth.json");
    const config = JSON.parse(Deno.readTextFileSync("./modrinth.json"));
    console.log(
      `${config.mods.length} mod(s)` +
        config.mods.map((slug: string) => `\n - ${slug}`).join()
    );
  } catch (_e) {
    error("Unable to find modrinth.json!");
  }
};

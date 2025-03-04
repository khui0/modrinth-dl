import { error, success, warn } from "./console.ts";

export default async () => {
  const input = Deno.args.slice(1);

  if (!input) {
    error("You must provide at least one slug");
    return;
  }

  const mods = input
    .map((item) => item.split(",").map((slug) => slug.trim()))
    .flat();

  if (mods.length === 0) {
    error("No mods provided! Enter one or more slugs");
    return;
  }

  try {
    await Deno.lstat("./modrinth.json");
    const config = JSON.parse(Deno.readTextFileSync("./modrinth.json"));

    const validProjects: string[] = [];
    const invalidProjects: string[] = [];

    mods.forEach((slug) => {
      if (config.mods && config.mods.length !== 0) {
        if (config.mods.includes(slug)) {
          validProjects.push(slug);
        } else {
          invalidProjects.push(slug);
        }
      }
    });

    if (config.mods && config.mods.length !== 0) {
      config.mods = config.mods.filter(
        (slug: string) => !validProjects.includes(slug)
      );
    }
    Deno.writeTextFileSync("./modrinth.json", JSON.stringify(config, null, 2));

    success(
      `Removed ${
        validProjects.length === 1
          ? validProjects[0]
          : `${validProjects.length} mod(s)`
      }`
    );
    if (invalidProjects.length > 0) {
      warn(
        `Unable to remove ${invalidProjects.length} mod(s)` +
          invalidProjects.map((slug) => `\n - ${slug}`).join()
      );
    }
  } catch (_e) {
    error("Unable to find modrinth.json!");
  }
};

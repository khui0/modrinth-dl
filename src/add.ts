import { error, success, warn } from "./console.ts";
import { isProjectValid } from "./modrinth.ts";

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

    const promises = mods.map((slug) => {
      const parts = slug.split(":");
      return isProjectValid(parts[0]).then((valid) => {
        if (valid) {
          validProjects.push(slug);
        } else {
          invalidProjects.push(slug);
        }
      });
    });

    await Promise.allSettled(promises);

    if (!config.mods || config.mods.length === 0) {
      config.mods = validProjects;
    } else {
      config.mods = [...config.mods, ...validProjects];
      // Remove duplicates
      config.mods = config.mods.filter(
        (value: string, index: number, array: string[]) =>
          array.indexOf(value) === index
      );
    }
    Deno.writeTextFileSync("./modrinth.json", JSON.stringify(config, null, 2));

    success(
      `Added ${
        validProjects.length === 1
          ? validProjects[0]
          : `${validProjects.length} mod(s)`
      }`
    );
    if (invalidProjects.length > 0) {
      warn(
        `Unable to add ${invalidProjects.length} mod(s)` +
          invalidProjects.map((slug) => `\n - ${slug}`).join()
      );
    }
  } catch (_e) {
    error("Unable to find modrinth.json!");
  }
};

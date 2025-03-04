import { error } from "./console.ts";
import { fetchProject } from "./modrinth.ts";

export default async () => {
  const input = Deno.args[1]?.trim();

  if (!input) {
    error("You must provide at least one slug");
    return;
  }

  const project = await fetchProject(input);

  if (!project) {
    error(`Unable to find ${input}`);
    return;
  }

  console.log(
    `%c${project.title}%c\n${project.description}\n%cUpdated%c: ${new Date(
      project.updated
    ).toLocaleString()}\n%cVersions%c: ${project.game_versions.join(
      ", "
    )}\n%cLoaders%c: ${project.loaders.join(", ")}`,
    "font-weight: bold",
    "font-weight: normal; color: gray; font-style: italic",
    "color: blue",
    "color: unset",
    "color: blue",
    "color: gray",
    "color: blue",
    "color: gray"
  );
};

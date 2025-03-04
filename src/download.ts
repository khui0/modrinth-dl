import { parseArgs } from "jsr:@std/cli/parse-args";
import {
  fetchLoaders,
  fetchProject,
  fetchProjectVersions,
  fetchVersions,
} from "./modrinth.ts";

const flags = parseArgs(Deno.args, {
  alias: {
    target: "t",
    loader: "l",
    out: "o",
  },
  string: ["target", "loader", "projects", "out"],
  default: {
    loader: "fabric",
    out: "./mods",
  },
});

try {
  await Deno.lstat(flags.o);
} catch (_e) {
  Deno.mkdirSync(flags.o);
}

const TARGET = flags.t;
const LOADER = flags.l;
const LIST = flags._.toString();

const MODRINTH_VERSIONS: string[] = (await fetchVersions()).map(
  (item: { version: string }) => item.version
);
const MODRINTH_LOADERS: string[] = (await fetchLoaders()).map(
  (item: { name: string }) => item.name
);

if (!TARGET) {
  console.error(
    "Missing target version! Specify target version using -t flag."
  );
  Deno.exit();
}

if (!MODRINTH_VERSIONS.includes(TARGET)) {
  console.error(`"${TARGET}" is not a valid version!`);
  Deno.exit();
}

if (!MODRINTH_LOADERS.includes(LOADER)) {
  console.error(`"${LOADER}" is not a valid loader!`);
  Deno.exit();
}

const projects = LIST.split(",").map((slug) => slug.trim());

projects.forEach(async (slug) => {
  const parts = slug.split(":");
  const versionType = parts[1]?.toLowerCase() || "release";

  const project = await fetchProject(parts[0]);
  if (!project) {
    console.error(`ERROR: Unable to find ${slug}`);
    return;
  }
  if (!project.loaders.includes(LOADER)) {
    console.error(`ERROR: ${parts[0]} does not support ${LOADER}!`);
    return;
  }
  if (!project.game_versions.includes(TARGET)) {
    console.error(`ERROR: ${parts[0]} does not support ${TARGET}!`);
    return;
  }

  const versions = (await fetchProjectVersions(parts[0])).filter(
    (item: { game_versions: string; loaders: string; version_type: string }) =>
      item.game_versions.includes(TARGET) &&
      item.loaders.includes(LOADER) &&
      item.version_type === versionType
  );

  if (versions.length === 0) {
    console.error(`ERROR: Unable to find matching version for ${slug}`);
    return;
  } else {
    const selected = versions[0];
    const fileURL = selected.files[0].url;
    const fileName = selected.files[0].filename;

    const res = await fetch(fileURL);
    const file = await Deno.open(`${flags.o}/${fileName}`, {
      create: true,
      write: true,
    });

    await res.body?.pipeTo(file.writable);
    console.log(`Downloading ${project.title} (${selected.name})...`);
  }
});

import { error } from "./console.ts";
import { fetchMetadata } from "./modrinth.ts";

export default async () => {
  try {
    await Deno.lstat("./modrinth.json");
    const config = JSON.parse(Deno.readTextFileSync("./modrinth.json"));

    await createDirectory(config.out);

    const metadata = await fetchMetadata(
      config.version,
      config.loader,
      config.mods
    );

    // deno-lint-ignore no-explicit-any
    metadata.metadata.forEach(async (selected: any) => {
      await downloadFile(
        selected.files[0].url,
        selected.files[0].filename,
        config.out
      );
      console.log(`Downloading ${selected.name}...`);
    });

    metadata.errors.forEach((item) => {
      error(item.error);
    });
  } catch (_e) {
    error("Unable to find modrinth.json!");
  }
};

async function createDirectory(path: string) {
  try {
    await Deno.lstat(path);
  } catch (_e) {
    Deno.mkdirSync(path);
  }
}

async function downloadFile(url: string, name: string, dir: string = ".") {
  const res = await fetch(url);
  const file = await Deno.open(`${dir}/${name}`, {
    create: true,
    write: true,
  });

  await res.body?.pipeTo(file.writable);
}

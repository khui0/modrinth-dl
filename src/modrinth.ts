export async function queryModrinth(endpoint: string) {
  const response = await fetch("https://api.modrinth.com/v2" + endpoint);
  if (response.ok) {
    return await response.json();
  }
}

export async function fetchProject(slug: string) {
  return await queryModrinth("/project/" + slug);
}

export async function fetchProjectVersions(slug: string) {
  return await queryModrinth("/project/" + slug + "/version");
}

export async function fetchVersions() {
  return await queryModrinth("/tag/game_version");
}

export async function fetchLoaders() {
  return await queryModrinth("/tag/loader");
}

export const MODRINTH_VERSIONS: string[] = (await fetchVersions()).map(
  (item: { version: string }) => item.version
);
export const MODRINTH_LOADERS: string[] = (await fetchLoaders()).map(
  (item: { name: string }) => item.name
);

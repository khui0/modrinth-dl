export async function queryModrinth(endpoint: string) {
  const response = await fetch("https://api.modrinth.com/v2" + endpoint);
  if (response.ok) {
    return await response.json();
  }
}

export const MODRINTH_VERSIONS: string[] = (await fetchVersions()).map(
  (item: { version: string }) => item.version
);
export const MODRINTH_LOADERS: string[] = (await fetchLoaders()).map(
  (item: { name: string }) => item.name
);

export async function isProjectValid(slug: string) {
  return await queryModrinth("/project/" + slug + "/check");
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

export async function fetchMetadata(
  target: string,
  loader: string,
  slugs: string[]
) {
  const metadata: {
    name?: string;
    version_number?: string;
    changelog?: string;
    dependencies?: unknown[];
    game_versions?: string[];
    version_type?: string;
    loaders?: string[];
    featured?: boolean;
    status?: string;
    requested_status?: string;
    id: string;
    project_id: string;
    author_id: string;
    date_published: string;
    downloads: number;
    changelog_url?: string;
    files: unknown[];
  }[] = [];
  const errors: {
    slug: string;
    error: string;
  }[] = [];

  const promises = slugs.map(async (slug: string) => {
    const parts = slug.split(":");
    const versionType = parts[1]?.toLowerCase() || "release";

    const project = await fetchProject(parts[0]);
    if (!project) {
      errors.push({ slug, error: `Unable to find ${slug}` });
    }
    if (!project.loaders.includes(loader)) {
      errors.push({
        slug,
        error: `${parts[0]} does not support loader: ${loader}`,
      });
    }
    if (!project.game_versions.includes(target)) {
      errors.push({
        slug,
        error: `${parts[0]} does not support version: ${target}`,
      });
    }

    const versions = (await fetchProjectVersions(parts[0])).filter(
      (item: {
        game_versions: string;
        loaders: string;
        version_type: string;
      }) =>
        item.game_versions.includes(target) &&
        item.loaders.includes(loader) &&
        item.version_type === versionType
    );

    if (versions.length === 0) {
      errors.push({
        slug,
        error: `Unable to find matching version for ${slug}`,
      });
    } else {
      const selected = versions[0];
      metadata.push(selected);
    }
    return;
  });

  await Promise.allSettled(promises);

  console.log(metadata);
}

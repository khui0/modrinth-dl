import { error } from "./console.ts";
import { searchProjects } from "./modrinth.ts";
import { timeSince } from "./time.ts";

export default async () => {
  const input = Deno.args[1]?.trim();

  if (!input) {
    error("You must provide at least one slug");
    return;
  }

  const results = await searchProjects(input);

  console.log(
    `%cResults for '${input}' %c(Showing ${results.limit} of ${results.total_hits})\n`,
    "font-weight: bold",
    "font-weight: normal; color: gray"
  );

  results.hits.forEach(
    (
      project: {
        title: string;
        slug: string;
        description: string;
        date_modified: string;
        client_side: "required" | "optional" | "unsupported" | "unknown";
        server_side: "required" | "optional" | "unsupported" | "unknown";
      },
      i: number
    ) => {
      console.log(
        `%c${i + 1}. ${project.title} %c(${
          project.slug
        })%c\nhttps://modrinth.com/mod/${project.slug}\n${
          project.description
        }\n%cUpdated%c: ${timeSince(
          new Date(project.date_modified)
        )}\n%cClient%c: ${
          project.client_side === "unsupported" ? "✗" : "✓"
        }\n%cServer%c: ${project.server_side === "unsupported" ? "✗" : "✓"}`,
        "font-weight: bold",
        "font-weight: normal;",
        "font-weight: normal; color: gray; font-style: italic",
        "color: blue",
        "color: unset",
        "color: blue",
        "color: gray",
        "color: blue",
        "color: gray"
      );
    }
  );
};

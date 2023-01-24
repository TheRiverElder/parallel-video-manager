import { loadProject } from "$lib/server/ProjectOperations";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (function load({ url }) {
    const projectPath = url.searchParams.get("path");
    if (!projectPath) throw error(500, "No project path");

    const projectData = loadProject(projectPath);
    if (!projectData) throw error(500, "No such a project");

    return projectData;
}) satisfies PageServerLoad;

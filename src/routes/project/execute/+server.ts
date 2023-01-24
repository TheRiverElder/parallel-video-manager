import { error, json, type RequestHandler } from "@sveltejs/kit";
import { execute, loadProject } from "$lib/server/ProjectOperations";

export const POST = (async ({ url }) => {
    const projectPath = url.searchParams.get("path");
    if (!projectPath) throw error(500, "No project path");

    try {
        const projectData = loadProject(projectPath);
        if (!projectData) throw error(400, "No such a project");

        return json(execute(projectPath, projectData));
    } catch (e) {
        throw error(500, (e instanceof Error) ? e.message : String(e));
    }
}) satisfies RequestHandler;
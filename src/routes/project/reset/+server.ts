import { error, type RequestHandler } from "@sveltejs/kit";
import { initializeProject } from "../../../lib/server/ProjectOperations";

export const POST = (async ({ url }) => {
    const amountPerPage = Number.parseInt(url.searchParams.get("amountPerPage") || "0") || 6;

    const projectPath = url.searchParams.get("path");
    if (!projectPath) throw error(500, "No project path");

    try {
        const projectData = initializeProject(projectPath, amountPerPage);
        return new Response();
    } catch (e) {
        throw error(500, (e instanceof Error) ? e.message : String(e));
    }
}) satisfies RequestHandler;
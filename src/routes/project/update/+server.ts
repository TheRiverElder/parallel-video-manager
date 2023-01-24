import { error, type RequestHandler } from "@sveltejs/kit";
import { getErrorMessage } from "../../Utils";
import { loadProject, saveProject } from "$lib/server/ProjectOperations";
import type { PlayerData } from "$lib/ProjectDataTypes";

export const POST = (async ({ request, url }) => {
    const projectPath = url.searchParams.get("path");
    if (!projectPath) throw error(500, "No project path");

    const playerData: PlayerData = await request.json();
    try {
        const projectData = loadProject(projectPath);
        if (!projectData) throw error(400, "No such a project");

        projectData.videoStates.splice(playerData.amountPerPage * playerData.pageIndex, playerData.videoStates.length, ...playerData.videoStates);
        projectData.amountPerPage = playerData.amountPerPage;

        saveProject(playerData.path, projectData);

        return new Response();
    } catch (e) {
        throw error(500, getErrorMessage(e));
    }
}) satisfies RequestHandler;
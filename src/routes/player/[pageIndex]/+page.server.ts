import { error, redirect } from "@sveltejs/kit";
import { loadProject, initializeProject } from "$lib/server/ProjectOperations";
import type { PageServerLoad } from "./$types";
import type { ProjectData, PlayerData } from "$lib/ProjectDataTypes";
import { getErrorMessage } from "../../Utils";

export const load = (function load({ params, url }) {
    const pageIndex = Number.parseInt(params.pageIndex) || 0;
    const amountPerPage = Number.parseInt(url.searchParams.get("amountPerPage") || "0") || 6;

    const projectPath = url.searchParams.get("path");
    if (!projectPath) throw error(400, "No project path");

    let projectData: ProjectData;
    try {
        projectData = loadProject(projectPath) || initializeProject(projectPath, amountPerPage);
    } catch (e) {
        throw error(500, getErrorMessage(e));
    }

    projectData.amountPerPage = amountPerPage;

    const startIndex = pageIndex * amountPerPage;
    // if (startIndex >= projectData.videoStates.length) throw redirect(300, "/project" + url.search);

    const playerData: PlayerData = {
        path: projectPath,
        amountPerPage,
        pageIndex,
        videoAmount: projectData.videoStates.length,
        videoStates: projectData.videoStates.slice(startIndex, startIndex + amountPerPage),
    };

    return playerData;

}) satisfies PageServerLoad<PlayerData>;


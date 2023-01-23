import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { readdirSync, statSync, existsSync, writeFileSync, readFileSync } from "fs";
import { resolve, extname } from "path";
import { Execution } from "./Execution";

export interface VideoState {
    name: string;
    viewed: boolean;
    execution: Execution;
}

export interface PlayerData {
    path: string;
    amountPerPage: number;
    pageIndex: number;
    videoAmount: number;
    videoStates: VideoState[];
}

export interface ProjectData {
    amountPerPage: number;
    videoStates: VideoState[];
}

export const load = (function load({ params, url }) {
    const pageIndex = Number.parseInt(params.pageIndex) || 0;
    const amountPerPage = Number.parseInt(url.searchParams.get("amountPerPage") || "0") || 6;

    const projectPath = url.searchParams.get("path");
    if (!projectPath) throw error(400, "No project path");

    try {
        const projectData: ProjectData = loadProject(projectPath) || initializeProject(projectPath, amountPerPage);
        projectData.amountPerPage = amountPerPage;

        const playerData: PlayerData = {
            path: projectPath,
            amountPerPage,
            pageIndex,
            videoAmount: projectData.videoStates.length,
            videoStates: projectData.videoStates.slice(pageIndex * amountPerPage, (pageIndex + 1) * amountPerPage),
        };

        return playerData;
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        throw error(500, message);
    }


}) satisfies PageServerLoad<PlayerData>;


function initializeProject(path: string, amountPerPage: number = 1): ProjectData {
    if (!existsSync(path)) throw new Error("Project error: Project directory does not exist");
    const stats = statSync(path);
    if (!stats.isDirectory()) throw new Error("Project error: Project pat is not a directory");

    const videoStates: VideoState[] = readdirSync(path)
        .filter(filterVideo)
        .map((name) => ({
            name,
            viewed: false,
            execution: Execution.UNSET,
        }));

    const projectData: ProjectData = {
        amountPerPage,
        videoStates,
    };
    writeFileSync(resolve(path, "pvm.json"), JSON.stringify(projectData), "utf-8");
    return projectData;
}

function loadProject(path: string): ProjectData | null {
    const projectDataFilePath = resolve(path, "pvm.json");
    if (!existsSync(projectDataFilePath)) return null;

    const stats = statSync(projectDataFilePath);
    if (!stats.isFile()) throw new Error("Load project failed");

    try {
        const jsonText = readFileSync(projectDataFilePath, "utf-8");
        const projectData: ProjectData = JSON.parse(jsonText);
        return projectData;
    } catch (e) {
        throw new Error("Project data corrupted");
    }
}

function saveProject(path: string, projectData: ProjectData): ProjectData {
    writeFileSync(resolve(path, "pvm.json"), JSON.stringify(projectData), "utf-8");
    return projectData;
}

const validVideoExtensionNames: string[] = [
    "mp4", "mpeg", "flv", "f4v", "3gp", "wmv",
].map(name => "." + name);

function filterVideo(name: string) {
    return validVideoExtensionNames.includes(extname(name));
}
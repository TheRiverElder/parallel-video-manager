import { resolve, extname } from "path";
import { readdirSync, statSync, existsSync, writeFileSync, readFileSync, rmSync, mkdirSync, renameSync } from "fs";
import { getErrorMessage } from "../../routes/Utils";
import { Execution, type ExecutionResult, type ProjectData, type VideoExecutionResult, type VideoState } from "$lib/ProjectDataTypes";


export function initializeProject(path: string, amountPerPage: number = 1): ProjectData {
    if (!existsSync(path)) throw new Error("Project error: Project directory does not exist");
    const stats = statSync(path);
    if (!stats.isDirectory()) throw new Error("Project error: Project pat is not a directory");

    const videoStates: VideoState[] = readdirSync(path)
        .filter(filterVideo)
        .map((name) => ({
            name,
            viewed: false,
            execution: Execution.UNSET,
            executed: false,
        }));

    const projectData: ProjectData = {
        amountPerPage,
        videoStates,
    };
    writeFileSync(resolve(path, "pvm.json"), JSON.stringify(projectData), "utf-8");
    return projectData;
}

export function loadProject(path: string): ProjectData | null {
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

export function saveProject(path: string, projectData: ProjectData): ProjectData {
    writeFileSync(resolve(path, "pvm.json"), JSON.stringify(projectData), "utf-8");
    return projectData;
}

const validVideoExtensionNames: string[] = [
    "mp4", "mpeg", "flv", "f4v", "3gp", "wmv",
].map(name => "." + name);

function filterVideo(name: string) {
    return validVideoExtensionNames.includes(extname(name));
}

export function execute(path: string, projectData: ProjectData): ExecutionResult {

    const videoExecutionResults: VideoExecutionResult[] = [];
    for (const state of projectData.videoStates) {
        const { name, execution, viewed, executed } = state;
        let succeeded: boolean = false;
        let errorMessage: string = "";

        if (executed) {
            succeeded = false;
            errorMessage = "Already executed";
        } else if (!viewed) {
            succeeded = false;
            state.executed = false;
            errorMessage = "Not viewed";
        } else {
            switch (execution) {
                case Execution.PRESERVE: {
                    try {
                        moveToDirectory(path, name, NAME_PRESERVED);
                        succeeded = true;
                    } catch(e) {
                        succeeded = false;
                        errorMessage = getErrorMessage(e);
                    }
                    break;
                }
                case Execution.DELETE: {
                    try {
                        moveToDirectory(path, name, NAME_RECYCLER_BIN);
                        succeeded = true;
                    } catch(e) {
                        succeeded = false;
                        errorMessage = getErrorMessage(e);
                    }
                    break;
                }
                case Execution.UNSET: {
                    succeeded = false;
                    errorMessage = "No execution";
                    break;
                }
            }
        }

        videoExecutionResults.push({ succeeded, errorMessage, name, execution });
        state.executed ||= succeeded;
    }

    // initializeProject(path);
    saveProject(path, projectData);

    return {
        path,
        videoExecutionResults,
    };
}

const NAME_PRESERVED = "Preserved";
const NAME_RECYCLER_BIN = "RecyclerBin";

function moveToDirectory(path: string, name: string, directoryName: string) {
    const filePath = resolve(path, name);
    const directoryPath = resolve(path, directoryName);
    const filePathInRecyclerBin = resolve(path, directoryName, name);

    if (!existsSync(directoryPath)) {
        mkdirSync(directoryPath);
    } else {
        const stats = statSync(directoryPath);
        if (!stats.isDirectory()) throw new Error("Target is not a directory: " + directoryPath);
    }

    renameSync(filePath, filePathInRecyclerBin);
}
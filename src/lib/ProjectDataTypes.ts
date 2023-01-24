
export enum Execution {
    UNSET,
    PRESERVE,
    DELETE,
}



export interface VideoState {
    name: string;
    viewed: boolean;
    execution: Execution;
    executed: boolean;
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



export interface ExecutionResult {
    path: string;
    videoExecutionResults: VideoExecutionResult[];
}

export interface VideoExecutionResult {
    succeeded: boolean;
    errorMessage: string;
    name: string;
    execution: Execution;
}
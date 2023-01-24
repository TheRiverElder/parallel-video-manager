import { Execution } from "$lib/ProjectDataTypes";

export function getExecutionName(execution: Execution) {
    switch (execution) {
        case Execution.UNSET:
            return '未设置';
        case Execution.PRESERVE:
            return '保留';
        case Execution.DELETE:
            return '删除';
    }
}
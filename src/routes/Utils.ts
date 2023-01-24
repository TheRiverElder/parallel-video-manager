export function getErrorMessage(e: any) {
    return Object.hasOwn(e, "message") ? e["message"] : JSON.stringify(e);
}
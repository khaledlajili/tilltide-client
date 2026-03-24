export interface CreateWorkspaceCommand {
    accountId: string;
    name: string;
}

export interface UpdateWorkspaceCommand {
    workspaceId: string;
    name: string;
}

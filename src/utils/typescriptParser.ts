import {InterfaceDeclaration, Project, TypeChecker} from "ts-morph";

export function extractTypeScriptTypes(filePath: string): Record<string, Record<string, string>> | null {
    const project = new Project();
    project.addSourceFileAtPath(filePath);
    const file = project.getSourceFile(filePath);
    if (!file) return null;

    const typeChecker: TypeChecker = project.getTypeChecker();
    const typeDefs: Record<string, Record<string, string>> = {};

    file.getInterfaces().forEach((iFace: InterfaceDeclaration) => {
        const tableName = iFace.getName();
        typeDefs[tableName] = {};

        iFace.getProperties().forEach((prop) => {
            typeDefs[tableName][prop.getName()] = typeChecker.getTypeAtLocation(prop).getText();
        });
    });

    return typeDefs;
}
import * as fs from "node:fs";
import {Parser} from 'node-sql-parser';

export type DatabaseProvider = "athena" | "bigquery" | "mysql" | "postgresql" | "redshift" | "snowflake";

export function extractSQLSchema(filePath: string, databaseProvider?: DatabaseProvider): Record<string, Record<string, string>> | null {
    const sqlContent = fs.readFileSync(filePath, "utf8");
    const parser = new Parser();

    try {
        const ast = parser.astify(sqlContent, { database: databaseProvider ?? "mysql" });

        if (!Array.isArray(ast)) return null; // Ensure AST is an array

        const schema: Record<string, Record<string, string>> = {};

        ast.forEach((stmt) => {
            if (stmt.type === "create") {
                if (!stmt.table) return;
                const tableName = stmt.table[0].table;
                schema[tableName] = {};

                if (!stmt.create_definitions) return;
                stmt.create_definitions.forEach((colDef: any) => {
                    if (colDef.resource === "column") {
                        const columnName = colDef.column.column;
                        schema[tableName][columnName] = colDef.definition.dataType.toUpperCase();
                    }
                });
            }
        });

        return schema;
    } catch (error) {
        console.error("Error parsing SQL schema:", error);
        return null;
    }
}
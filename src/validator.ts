import {extractTypeScriptTypes} from "./utils/typescriptParser";
import {DatabaseProvider, extractSQLSchema} from "./utils/sqlParser";

interface ValidationError {
    message: string;
    table?: string;
    column?: string;
}

const TYPE_MAPPING: Record<string, string[]> = {
    "string": ["TEXT", "VARCHAR", "CHAR"],
    "number": ["INTEGER", "BIGINT", "DECIMAL", "FLOAT", "DOUBLE"],
    "boolean": ["BOOLEAN"],
    "Date": ["DATE", "TIMESTAMP"],
};

export function validator(typesFilePath: string, schemaFilePath: string, databaseProvider?: DatabaseProvider): ValidationError[] {
    const errors: ValidationError[] = [];

    // 1. Extract TypeScript types
    const typeDefinitions = extractTypeScriptTypes(typesFilePath);
    if (!typeDefinitions) {
        errors.push({ message: `Failed to parse TypeScript types from ${typesFilePath}` });
        return errors;
    }

    // 2. Extract SQL schema definitions
    const schemaDefinitions = extractSQLSchema(schemaFilePath, databaseProvider);
    if (!schemaDefinitions) {
        errors.push({ message: `Failed to parse SQL schema from ${schemaFilePath}` });
        return errors;
    }

    // 3. Compare schemas
    for (const [table, tsColumns] of Object.entries(typeDefinitions)) {
        if (!(table in schemaDefinitions)) {
            errors.push({ message: `Missing table in SQL schema: ${table}` });
            continue;
        }

        const sqlColumns = schemaDefinitions[table];

        // Check for missing columns in SQL
        for (const [column, tsType] of Object.entries(tsColumns)) {
            if (!(column in sqlColumns)) {
                errors.push({ message: `Missing column in SQL: ${table}.${column}` });
            } else {
                // Type validation (basic example)
                const sqlType = sqlColumns[column];
                if (!isTypeCompatible(tsType, sqlType)) {
                    errors.push({
                        message: `Type mismatch for ${table}.${column}: Expected ${sqlType}, got ${tsType}`,
                        table,
                        column,
                    });
                }
            }
        }

        // Check for extra columns in SQL
        for (const sqlColumn of Object.keys(sqlColumns)) {
            if (!(sqlColumn in tsColumns)) {
                errors.push({ message: `Extra column in SQL not in TypeScript: ${table}.${sqlColumn}` });
            }
        }
    }

    return errors;
}

function isTypeCompatible(tsType: string, sqlType: string): boolean {
    return Object.entries(TYPE_MAPPING).some(([ts, sqls]) =>
        tsType.includes(ts) && sqls.some((sql) => sqlType.includes(sql))
    );
}
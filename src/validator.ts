import {extractTypeScriptTypes} from "./utils/typescriptParser";
import {DatabaseProvider, extractSQLSchema} from "./utils/sqlParser";
import {mergeRecords, ParsedRecord} from "./parseRecords";

interface ValidationError {
    message: string;
    table?: string;
    column?: string;
}

type ValidatorOptions = ({
    typesFilePath: string;
    typesFilesPaths?: never;
    schemaFilePath: string;
    schemaFilesPaths?: never;
} | {
    typesFilePath?: never;
    typesFilesPaths: string[];
    schemaFilePath?: never;
    schemaFilesPaths: string[];
}) & {
    databaseProvider?: DatabaseProvider;
}


const TYPE_MAPPING: Record<string, string[]> = {
    "string": ["TEXT", "VARCHAR", "CHAR"],
    "number": ["INTEGER", "BIGINT", "DECIMAL", "FLOAT", "DOUBLE"],
    "boolean": ["BOOLEAN"],
    "Date": ["DATE", "TIMESTAMP"],
};

function prepareRecords(typesPaths: string[], sqlPaths: string[]): {ts: ParsedRecord, sql: ParsedRecord} {
    const typeDefinitions = typesPaths.reduce<ParsedRecord[]>((records, currentPath) => {
        const record = extractTypeScriptTypes(currentPath);

        if (!record) {
            console.warn(`Failed to parse TypeScript types from ${currentPath}`);
        } else {
            records.push(record);
        }
        return records;
    }, []);

    const ts = mergeRecords(typeDefinitions);

    const schemaDefinitions = sqlPaths.reduce<ParsedRecord[]>((records, currentPath) => {
        const record = extractSQLSchema(currentPath);

        if (!record) {
            console.warn(`Failed to parse SQL schema from ${currentPath}`);
        } else {
            records.push(record);
        }
        return records;
    }, []);

    const sql = mergeRecords(schemaDefinitions);

    return {ts, sql};
}

export function validateSchemas(options: ValidatorOptions): ValidationError[] {
    const typesPaths: string[] = [] ;
    let sqlPaths: string[]=  [];

    if (options.typesFilePath && options.schemaFilePath) {
        typesPaths.push(options.typesFilePath);
        sqlPaths.push(options.schemaFilePath);
    } else if (options.typesFilesPaths && options.schemaFilesPaths) {
        typesPaths.push(...options.typesFilesPaths);
        sqlPaths.push(...options.schemaFilesPaths);
    } else {
        throw new Error("Invalid options provided");
    }

    const {ts, sql} = prepareRecords(typesPaths, sqlPaths);

    return validateRecords(ts, sql);
}

function validateRecords(typeDefinitions: ParsedRecord, schemaDefinitions: ParsedRecord): ValidationError[] {
    const errors: ValidationError[] = [];

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
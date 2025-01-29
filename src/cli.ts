import {Command} from "commander";
import {validator} from "./validator";

const program = new Command();

function isDatabaseProviderKnown(provider?: string): boolean {
    if (!provider) {
        return true;
    }
    return ["athena", "bigquery", "mysql", "postgresql", "redshift", "snowflake"].includes(provider.toLowerCase());
}

program
    .version('0.0.1')
    .description('validate the sql schema')
    .requiredOption('-s, --schema <sqlSchema>', 'sql schema to be tested')
    .requiredOption('-t, --types <typescript types>', 'types to validate against the schema')
    .option('-d, --database <databaseProvider>', 'database provider to use for parsing the schema')
    .action((options: {
        schema: string,
        types: string,
        database?: string,
    }) => {
        if (!isDatabaseProviderKnown(options.database)) {
            console.error('Unknown database provider:', options.database);
            process.exit(1);
        }
        const errors = validator(options.types, options.schema);

        if (errors.length > 0) {
            errors.forEach((error) => {
                console.error(error.message);
            });
            process.exit(1);
        }
    });

program.parse();
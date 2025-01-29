# kysely-schema-validator

🚧 Work in Progress – This project is currently in active development. 🚧

A TypeScript library and CLI tool for validating database schemas against Kysely TypeScript types. Supports SQL file parsing, direct DB introspection, and schema drift detection. Easily integrates into CI/CD pipelines or custom applications.

## Installation

Your run-of-the-mill npm package.

```bash
npm install
npm build
# to see cli usage
node dist/cli.js --help
```

## Usage

You can either use the cli or the API (look for method `validator`).


## Planned Features

- Schema Validation – Compare SQL schema definitions with Kysely TypeScript types.
- SQL Parsing & Introspection – Validate against a .sql file or a live database.
- Standard & DB-Specific Support – Start with SQL standard, extend for PostgreSQL.
- Two Integration Modes:
  - CLI Tool – Run schema validation from the command line.
  - Programmatic API – Use a TypeScript function to integrate into custom scripts.

## Status

Naive implementation of schema validation is complete.
Relational constraints will not be supported.(just check for column names and types, if it exists it's good)
Does not yet support kysely specifics.

Repository needs to be refactored & cleaned up.
Not yet published to npm.

DB introspection is scheduled but not yet implemented.

This project is in early development. Expect breaking changes until version 0.x stabilizes. Contributions, feedback, and ideas are welcome!

## License

Licensed under Apache 2.0.
import {describe} from "mocha";
import {extractSQLSchema} from "./sqlParser";
import {expect} from "chai";

describe("sqlParser", () => {
    it('parse a simple sql schema', () => {
        const record = extractSQLSchema('samples/sql/mysql/user.sql');

        expect(record).to.deep.equal({
            User: {
                id: 'INTEGER',
                name: 'TEXT',
                email: 'TEXT',
                createdAt: 'TIMESTAMP',
            }
        });
    });

    it('parse a schema with multiple tables', () => {
        const record = extractSQLSchema('samples/sql/mysql/userAndItem.sql');

        expect(record).to.deep.equal({
            User: {
                id: 'INTEGER',
                name: 'TEXT',
                email: 'TEXT',
                createdAt: 'TIMESTAMP',
            },
            Item: {
                id: 'INTEGER',
                name: 'TEXT',
                price: 'FLOAT',
                createdAt: 'TIMESTAMP',
            }
        });
    })
});
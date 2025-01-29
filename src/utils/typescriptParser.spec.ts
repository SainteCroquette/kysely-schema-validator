import {describe} from "mocha";
import {expect} from "chai";
import {extractTypeScriptTypes} from "./typescriptParser";

describe("typescriptParser", () => {
    it('parse a simple Typescript interface', () => {
        const record = extractTypeScriptTypes('samples/types/user.ts');

        expect(record).to.deep.equal({
            User: {
                id: 'number',
                name: 'string',
                email: 'string',
                createdAt: 'Date',
            }
        });
    });
});
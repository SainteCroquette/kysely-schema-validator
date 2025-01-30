import {expect} from "chai";
import {validateSchemas} from "./validator";

describe("Parser Functions", () => {
    it('validates a typescript interface against a sql schema', () => {
        const errors = validateSchemas({typesFilePath: 'samples/types/user.ts', schemaFilePath: 'samples/sql/mysql/user.sql'});

        expect(errors.length).to.equal(0);
    });

    it('returns an error when the typescript interface is missing a field', () => {
        const errors = validateSchemas({typesFilePath: 'samples/types/user.ts', schemaFilePath: 'samples/sql/mysql/userSurname.sql'});

        console.log('errors: ', errors);
        expect(errors.length).to.equal(1);
    });

    it('returns an error when the sql schema interface is missing a field', () => {
        const errors = validateSchemas({typesFilePath: 'samples/types/userSurname.ts', schemaFilePath: 'samples/sql/mysql/user.sql'});

        console.log('errors: ', errors);
        expect(errors.length).to.equal(1);
    });
});
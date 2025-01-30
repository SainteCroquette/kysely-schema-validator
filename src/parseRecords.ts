export type ParsedRecord = Record<string, Record<string, string>>;

export function mergeRecords(records: ParsedRecord[]): ParsedRecord {
    const mergedRecord: ParsedRecord = {};

    for (const record of records) {
        for (const key in record) {
            if (mergedRecord.hasOwnProperty(key)) {
                throw new Error(`Duplicate key found: "${key}"`);
            }
            mergedRecord[key] = record[key];
        }
    }

    return mergedRecord;
}
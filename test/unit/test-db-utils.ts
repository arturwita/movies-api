import { join } from "path";

export const getDbPath = (dbFileName: string): string => join(process.cwd(), `test/unit/data/${dbFileName}`);

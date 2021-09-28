import { Exception, HTTP_ERROR_CODE } from "../../../src/error";

describe("Exception", () => {
    it("Should be an instance of Error", () => {
        // when
        const exception = new Exception(400, "Bad Request", HTTP_ERROR_CODE.BAD_REQUEST);

        // then
        expect(exception).toBeInstanceOf(Error);
    });
});

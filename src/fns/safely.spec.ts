import { expectType } from "tsd";
import { safely } from "./safely";
import type { Result } from "../result";

describe("safely", () => {
	it("should handle value", () => {
		const result = safely(() => "foo");
		expectType<Result<string, unknown>>(result);
		expect(result).toMatchObject({ Ok: true, value: "foo" });
	});

	it("should handle thrown error", () => {
		const result = safely(() => {
			throw new TypeError("bar");
		});
		expectType<Result<never, unknown>>(result);
		expect(result).toMatchObject({ Err: true, error: { message: "bar" } });
	});

	it("should handle promise value", async () => {
		const result = await safely(() => (async () => "foo")());
		expectType<Result<string, unknown>>(result);
		expect(result).toMatchObject({ Ok: true, value: "foo" });
	});

	it("should handle promise value", async () => {
		const result = await safely(() =>
			(async () => {
				throw new TypeError("bar");
			})()
		);
		expectType<Result<never, unknown>>(result);
		expect(result).toMatchObject({ Err: true, error: { message: "bar" } });
	});
});

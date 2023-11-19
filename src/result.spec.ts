import type { Expect, Equal } from "./shared/tests";
import { Result } from "./result";

describe("Result.from", () => {
	it("should handle value", () => {
		const $value = Result.from((): string => "foo");
		({}) as [Expect<Equal<typeof $value, Result<string, unknown>>>];
		expect($value).toMatchObject({ _type: "Ok", value: "foo" });
	});

	it("should handle union value", () => {
		const $value = Result.from(() => "foo" as string | undefined);
		({}) as [Expect<Equal<typeof $value, Result<string | undefined, unknown>>>];
		expect($value).toMatchObject({ _type: "Ok", value: "foo" });
	});

	it("should handle error", () => {
		const $value = Result.from(() => {
			throw new TypeError("bar");
		});
		({}) as [Expect<Equal<typeof $value, Result>>];
		expect($value).toMatchObject({ _type: "Error", error: { message: "bar" } });
	});

	it("should handle promise value", async () => {
		const $value = await Result.from(() => (async () => "foo")());
		({}) as [Expect<Equal<typeof $value, Result<string, unknown>>>];
		expect($value).toMatchObject({ _type: "Ok", value: "foo" });
	});

	it("should handle promise union value", async () => {
		const $value = await Result.from(() =>
			(async () => "foo" as string | undefined)()
		);
		({}) as [Expect<Equal<typeof $value, Result<string | undefined, unknown>>>];
		expect($value).toMatchObject({ _type: "Ok", value: "foo" });
	});

	it("should handle promise error", async () => {
		const $value = await Result.from(() =>
			(async () => {
				throw new TypeError("bar");
			})()
		);
		({}) as [Expect<Equal<typeof $value, Result<never, unknown>>>];
		expect($value).toMatchObject({ _type: "Error", error: { message: "bar" } });
	});

	it("should handle any as unknown", () => {
		const $value = Result.from(() => JSON.parse(""));
		({}) as [Expect<Equal<typeof $value, Result<unknown, unknown>>>];
	});
});

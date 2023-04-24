import type { Expect, Equal } from "./testutils";
import { safely } from "./safely";
import type { Result } from "./result";

describe("safely", () => {
	it("should handle value", () => {
		const $value = safely((): string => "foo");
		({}) as [Expect<Equal<typeof $value, Result<string>>>];
		expect($value).toMatchObject({ is: "Ok", value: "foo" });
	});

	it("should handle union value", () => {
		const $value = safely(() => "foo" as string | undefined);
		({}) as [Expect<Equal<typeof $value, Result<string | undefined>>>];
		expect($value).toMatchObject({ is: "Ok", value: "foo" });
	});

	it("should handle error", () => {
		const $value = safely(() => {
			throw new TypeError("bar");
		});
		({}) as [Expect<Equal<typeof $value, Result<never>>>];
		expect($value).toMatchObject({ is: "Error", error: { message: "bar" } });
	});

	it("should handle promise value", async () => {
		const $value = await safely(() => (async () => "foo")());
		({}) as [Expect<Equal<typeof $value, Result<string>>>];
		expect($value).toMatchObject({ is: "Ok", value: "foo" });
	});

	it("should handle promise union value", async () => {
		const $value = await safely(() =>
			(async () => "foo" as string | undefined)()
		);
		({}) as [Expect<Equal<typeof $value, Result<string | undefined>>>];
		expect($value).toMatchObject({ is: "Ok", value: "foo" });
	});

	it("should handle promise error", async () => {
		const $value = await safely(() =>
			(async () => {
				throw new TypeError("bar");
			})()
		);
		({}) as [Expect<Equal<typeof $value, Result<never>>>];
		expect($value).toMatchObject({ is: "Error", error: { message: "bar" } });
	});

	it("should handle any as unknown", () => {
		const $value = safely(() => JSON.parse(""));
		({}) as [Expect<Equal<typeof $value, Result>>];
	});
});

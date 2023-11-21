import type { Expect, Equal } from "./shared/tests";
import { Result } from "./result";

describe("Result.try", () => {
	it("should handle value", () => {
		const $value = Result.try((): string => "foo");
		({}) as [Expect<Equal<typeof $value, Result<string, unknown>>>];
		expect($value).toMatchObject({ _type: "Ok", value: "foo" });
	});

	it("should handle union value", () => {
		const $value = Result.try(() => "foo" as string | undefined);
		({}) as [Expect<Equal<typeof $value, Result<string | undefined, unknown>>>];
		expect($value).toMatchObject({ _type: "Ok", value: "foo" });
	});

	it("should handle error", () => {
		const $value = Result.try(() => {
			throw new TypeError("bar");
		});
		({}) as [Expect<Equal<typeof $value, Result>>];
		expect($value).toMatchObject({ _type: "Error", error: { message: "bar" } });
	});

	it("should handle promise value", async () => {
		const $value = await Result.try(() => (async () => "foo")());
		({}) as [Expect<Equal<typeof $value, Result<string, unknown>>>];
		expect($value).toMatchObject({ _type: "Ok", value: "foo" });
	});

	it("should handle promise union value", async () => {
		const $value = await Result.try(() =>
			(async () => "foo" as string | undefined)()
		);
		({}) as [Expect<Equal<typeof $value, Result<string | undefined, unknown>>>];
		expect($value).toMatchObject({ _type: "Ok", value: "foo" });
	});

	it("should handle promise error", async () => {
		const $value = await Result.try(() =>
			(async () => {
				throw new TypeError("bar");
			})()
		);
		({}) as [Expect<Equal<typeof $value, Result<never, unknown>>>];
		expect($value).toMatchObject({ _type: "Error", error: { message: "bar" } });
	});

	it("should handle any as unknown", () => {
		const $value = Result.try(() => JSON.parse(""));
		({}) as [Expect<Equal<typeof $value, Result<unknown, unknown>>>];
	});
});

test("Ok/Error", () => {
	void function getFoo(): Result<string, "ParseError"> {
		if (Math.random() === 1) {
			// @ts-expect-error "1" is not assignable to "ParseError".
			return Result.Error("1");
		}
		if (Math.random() === 1) {
			// @ts-expect-error Expecting an arg.
			return Result.Error();
		}
		if (Math.random() === 1) {
			// @ts-expect-error 1 is not assignable to `string`.
			return Result.Ok(1);
		}
		if (Math.random() === 1) {
			// @ts-expect-error Expecting an arg.
			return Result.Ok();
		}
		if (Math.random() === 1) {
			return Result.Error("ParseError");
		}
		return Result.Ok("1");
	};

	void async function getFooAsync(): Promise<Result<string, "ParseError">> {
		if (Math.random() === 1) {
			// @ts-expect-error "1" is not assignable to "ParseError".
			return Result.Error("1");
		}
		if (Math.random() === 1) {
			// @ts-expect-error Expecting an arg.
			return Result.Error();
		}
		if (Math.random() === 1) {
			// @ts-expect-error 1 is not assignable to `string`.
			return Result.Ok(1);
		}
		if (Math.random() === 1) {
			// @ts-expect-error Expecting an arg.
			return Result.Ok();
		}
		if (Math.random() === 1) {
			return Result.Error("ParseError");
		}
		return Result.Ok("");
	};

	void function getResult(): Result {
		if (Math.random() === 1) {
			return Result.Error();
		}
		return Result.Ok();
	};

	void function getAnything(): string {
		// @ts-expect-error Not assignable to return type.
		return Result.Ok();
	};
});

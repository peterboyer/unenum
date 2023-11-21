import type { Expect, Equal } from "./shared/tests";
import { type Result, ResultTry, ResultOk, ResultError } from "./result";

describe("ResultTry", () => {
	it("should handle value", () => {
		const $value = ResultTry((): string => "foo");
		({}) as [Expect<Equal<typeof $value, Result<string, unknown>>>];
		expect($value).toMatchObject({ _type: "Ok", value: "foo" });
	});

	it("should handle union value", () => {
		const $value = ResultTry(() => "foo" as string | undefined);
		({}) as [Expect<Equal<typeof $value, Result<string | undefined, unknown>>>];
		expect($value).toMatchObject({ _type: "Ok", value: "foo" });
	});

	it("should handle error", () => {
		const $value = ResultTry(() => {
			throw new TypeError("bar");
		});
		({}) as [Expect<Equal<typeof $value, Result>>];
		expect($value).toMatchObject({ _type: "Error", error: { message: "bar" } });
	});

	it("should handle promise value", async () => {
		const $value = await ResultTry(() => (async () => "foo")());
		({}) as [Expect<Equal<typeof $value, Result<string, unknown>>>];
		expect($value).toMatchObject({ _type: "Ok", value: "foo" });
	});

	it("should handle promise union value", async () => {
		const $value = await ResultTry(() =>
			(async () => "foo" as string | undefined)()
		);
		({}) as [Expect<Equal<typeof $value, Result<string | undefined, unknown>>>];
		expect($value).toMatchObject({ _type: "Ok", value: "foo" });
	});

	it("should handle promise error", async () => {
		const $value = await ResultTry(() =>
			(async () => {
				throw new TypeError("bar");
			})()
		);
		({}) as [Expect<Equal<typeof $value, Result<never, unknown>>>];
		expect($value).toMatchObject({ _type: "Error", error: { message: "bar" } });
	});

	it("should handle any as unknown", () => {
		const $value = ResultTry(() => JSON.parse(""));
		({}) as [Expect<Equal<typeof $value, Result<unknown, unknown>>>];
	});
});

test("Ok/Error", () => {
	void function getFoo(): Result<string, "ParseError"> {
		if (Math.random() === 1) {
			// @ts-expect-error "1" is not assignable to "ParseError".
			return ResultError("1");
		}
		if (Math.random() === 1) {
			// @ts-expect-error Expecting an arg.
			return ResultError();
		}
		if (Math.random() === 1) {
			// @ts-expect-error 1 is not assignable to `string`.
			return ResultOk(1);
		}
		if (Math.random() === 1) {
			// @ts-expect-error Expecting an arg.
			return ResultOk();
		}
		if (Math.random() === 1) {
			return ResultError("ParseError");
		}
		return ResultOk("1");
	};

	void async function getFooAsync(): Promise<Result<string, "ParseError">> {
		if (Math.random() === 1) {
			// @ts-expect-error "1" is not assignable to "ParseError".
			return ResultError("1");
		}
		if (Math.random() === 1) {
			// @ts-expect-error Expecting an arg.
			return ResultError();
		}
		if (Math.random() === 1) {
			// @ts-expect-error 1 is not assignable to `string`.
			return ResultOk(1);
		}
		if (Math.random() === 1) {
			// @ts-expect-error Expecting an arg.
			return ResultOk();
		}
		if (Math.random() === 1) {
			return ResultError("ParseError");
		}
		return ResultOk("");
	};

	void function getResult(): Result {
		if (Math.random() === 1) {
			return ResultError();
		}
		return ResultOk();
	};

	void function getAnything(): string {
		// @ts-expect-error Not assignable to return type.
		return ResultOk();
	};
});

import { expectType } from "tsd";
import type { Enum } from "./enum";
import type { Result } from "./result";

describe("Result", () => {
	it("should support unknown values", () => {
		const result = ((): Result => {
			if (Math.random()) {
				return { Err: true, error: "FooError" };
			}
			return { Ok: true, value: "foo" };
		})();
		if (result.Ok) {
			expectType<unknown>(result.value);
		} else {
			expectType<unknown>(result.error);
		}
	});

	it("should support specified values", () => {
		const result = ((): Result<string, "FooError"> => {
			if (Math.random()) {
				return { Err: true, error: "FooError" };
			}
			return { Ok: true, value: "foo" };
		})();
		expectType<string | undefined>(result.value);
		expectType<"FooError" | undefined>(result.error);
		if (result.Ok) {
			expectType<string>(result.value);
		} else {
			expectType<"FooError">(result.error);
		}
	});

	it("should support picking a single variant", () => {
		const result = (():
			| Enum.Pick<Result<string, "FooError">, "Err">
			| undefined => {
			if (Math.random()) {
				return { Err: true, error: "FooError" };
			}
			return;
		})();
		if (result) {
			expectType<"FooError">(result.error);
			if (result.Err) {
				expectType<string>(result.error);
			}
		} else {
			expectType<undefined>(result);
		}
	});
});

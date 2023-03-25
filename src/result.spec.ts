import { expectType } from "tsd";
import type { Result } from "./result";

describe("Result", () => {
	it("should support unknown values", () => {
		const result = ((): Result => {
			if (Math.random()) {
				return { Err: { value: "FooError" } };
			}
			return { Ok: { value: "foo" } };
		})();
		if (result.Ok) {
			expectType<unknown>(result.Ok.value);
		} else {
			expectType<unknown>(result.Err.value);
		}
	});

	it("should support specified values", () => {
		const result = ((): Result<string, "FooError"> => {
			if (Math.random()) {
				return { Err: { value: "FooError" } };
			}
			return { Ok: { value: "foo" } };
		})();
		if (result.Ok) {
			expectType<string>(result.Ok.value);
		} else {
			expectType<"FooError">(result.Err.value);
		}
	});

	it("should support picking a single variant", () => {
		const result = ((): Pick<Result<string, "FooError">, "Err"> | undefined => {
			if (Math.random()) {
				return { Err: { value: "FooError" } };
			}
			return;
		})();
		if (result) {
			if (result.Err) {
				expectType<string>(result.Err.value);
			}
		} else {
			expectType<undefined>(result);
		}
	});
});

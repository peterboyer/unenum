import { expectType } from "tsd";
import type { Result } from "./result";

test("Result", () => {
	const $ = ((): Result => {
		return Math.random()
			? { Ok: true, value: "foo" }
			: { Err: true, error: "FooError" };
	})();

	if ($.Ok) {
		expectType<unknown>($.value);
	} else {
		expectType<unknown>($.error);
	}
});

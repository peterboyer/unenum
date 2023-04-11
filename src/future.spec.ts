import { expectType } from "tsd";
import type { Future } from "./future";
import type { Result } from "./result";

test("Async", () => {
	const $ = ((): Future<Result<string, "FooError">> => {
		return Math.random()
			? { Pending: true }
			: Math.random()
			? { Ok: true, value: "foo" }
			: { Err: true, error: "FooError" };
	})();

	if ($.Pending) {
		// @ts-expect-error Property only exists on Result.
		expectType<unknown>($.value);
		// @ts-expect-error Property only exists on Result.
		expectType<unknown>($.error);
	} else {
		expectType<string | undefined>($.value);
		expectType<"FooError" | undefined>($.error);
		if ($.Ok) {
			expectType<string>($.value);
			// @ts-expect-error Must not be undefined.
			expectType<typeof $.value>({} as string | undefined);
		} else {
			expectType<"FooError">($.error);
			// @ts-expect-error Must not be undefined.
			expectType<typeof $.error>({} as "FooError" | undefined);
		}
	}
});

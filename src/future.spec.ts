import { expectType } from "tsd";
import type { Future } from "./future";

describe("Future", () => {
	it("should support unknown values", () => {
		const future = ((): Future => {
			if (Math.random()) {
				return { Pending: true };
			}
			return { Ready: { value: "foo" } };
		})();
		if (future.Pending) {
			expectType<true>(future.Pending);
		} else {
			expectType<unknown>(future.Ready.value);
		}
	});

	it("should support specified values", () => {
		const future = ((): Future<string> => {
			if (Math.random()) {
				return { Pending: true };
			}
			return { Ready: { value: "foo" } };
		})();
		if (future.Pending) {
			expectType<true>(future.Pending);
		} else {
			expectType<string>(future.Ready.value);
		}
	});
});

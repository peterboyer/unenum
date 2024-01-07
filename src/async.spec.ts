import { branch } from "./shared/branch.js";
import { Async } from "./async.js";

describe("Ready/Pending", () => {
	test("Ready", () => {
		expect(Async.Ready()).toStrictEqual({
			_type: "Ready",
			value: undefined,
		});
		expect(Async.Ready("...") as Async<string>).toStrictEqual({
			_type: "Ready",
			value: "...",
		});
	});

	test("Pending", () => {
		expect(Async.Pending()).toStrictEqual({
			_type: "Pending",
		});
	});

	void function getFoo(): Async<string> {
		if (branch()) {
			// @ts-expect-error Expecting an arg.
			return Async.Ready();
		}
		if (branch()) {
			// @ts-expect-error 1 is not assignable to `string`.
			return Async.Ready(1);
		}
		if (branch()) {
			return Async.Pending();
		}
		return Async.Ready("1");
	};

	void async function getFooAsync(): Promise<Async<string>> {
		if (branch()) {
			// @ts-expect-error Expecting an arg.
			return Async.Ready();
		}
		if (branch()) {
			// @ts-expect-error 1 is not assignable to `string`.
			return Async.Ready(1);
		}
		if (branch()) {
			return Async.Pending();
		}
		return Async.Ready("1");
	};

	void function getResult(): Async {
		if (branch()) {
			return Async.Pending();
		}
		return Async.Ready();
	};

	void function getAnything(): string {
		if (branch()) {
			// @ts-expect-error Not assignable to return type.
			return Async.Pending();
		}
		if (branch()) {
			// @ts-expect-error Not assignable to return type.
			return Async.Pending("...");
		}
		if (branch()) {
			// @ts-expect-error Not assignable to return type.
			return Async.Ready();
		}
		if (branch()) {
			// @ts-expect-error Not assignable to return type.
			return Async.Ready("...");
		}
		return "...";
	};
});

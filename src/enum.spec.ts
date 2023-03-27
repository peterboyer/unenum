import { expectType } from "tsd";
import type { Enum } from "./enum";

describe("Enum", () => {
	it("should support an enum of one", () => {
		const result = ((): Enum<{ A: string }> => {
			return { A: { value: "a" } };
		})();
		if (result.A) {
			expectType<string>(result.A.value);
		} else {
			expectType<never>(result.A);
		}
	});

	it("should support an enum of many", () => {
		const result = ((): Enum<{ A: string; B: number }> => {
			if (Math.random()) {
				return { A: { value: "a" } };
			}
			return { B: { value: 1 } };
		})();
		if (result.A) {
			expectType<string>(result.A.value);
		} else {
			expectType<number>(result.B.value);
		}
	});

	it("should support an enum with possible undefined", () => {
		const result = ((): Enum<{ A: string; B: number | undefined }> => {
			if (Math.random()) {
				return { A: { value: "a" } };
			}
			return { B: { value: 1 } };
		})();
		if (result.A) {
			expectType<string>(result.A.value);
		} else {
			expectType<number | undefined>(result.B.value);
		}
	});

	it("should support an unknown generic variable type", () => {
		const result = (<T>(
			value: T
		): Enum<{
			A: T;
			B?: void;
		}> => {
			if (value) {
				return { A: { value } };
			}
			return { B: true };
		})(Math.random());
		if (result.A) {
			expectType<number>(result.A.value);
		} else {
			expectType<true>(result.B);
		}
	});

	describe("Infer", () => {
		it("should revert root enum variants", () => {
			type MyEnum = Enum<{ A: string; B: number }>;
			expectType<{ A: string; B: number }>({} as Enum.Infer<MyEnum>);
		});

		it("should revert root enum variants without values", () => {
			type MyEnum = Enum<{ A: string; B?: void }>;
			expectType<{ A: string; B?: void }>({} as Enum.Infer<MyEnum>);
		});
	});
});

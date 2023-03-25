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
		): Enum<{ A: Enum.Generic<T>; B: undefined }> => {
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
		type MyEnum = Enum<{ A: string; B: undefined }>;

		it("should extract value of non-undefined variant value", () => {
			expectType<string>({} as Enum.Infer<MyEnum, "A">);
		});

		it("should give undefined of undefined variant value", () => {
			expectType<undefined>(undefined as Enum.Infer<MyEnum, "B">);
		});
	});

	describe("Root", () => {
		it("should revert root enum variants", () => {
			type MyEnum = Enum<{ A: string; B: number }>;
			expectType<{ A: string; B: number }>({} as Enum.Root<MyEnum>);
		});

		it("should revert root enum variants without values", () => {
			type MyEnum = Enum<{ A: string; B: undefined }>;
			expectType<{ A: string; B: undefined }>({} as Enum.Root<MyEnum>);
		});
	});
});

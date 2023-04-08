import { expectType } from "tsd";
import type { Enum } from "./enum";

describe("Enum", () => {
	it("should support an enum of one", () => {
		const result = ((): Enum<{
			A: { value: string };
		}> => {
			return { A: true, value: "a" };
		})();
		if (result.A) {
			expectType<string>(result.value);
		} else {
			expectType<typeof result.A extends never ? true : false>(true as const);
		}
	});

	it("should support an enum of many", () => {
		const result = ((): Enum<{
			A: { value: string };
			B: { value: number };
			C: undefined;
		}> => {
			if (Math.random()) {
				return { A: true, value: "a" };
			}
			return { B: true, value: 123 };
		})();
		if (result.A) {
			expectType<string>(result.value);
		} else if (result.B) {
			expectType<number>(result.value);
		} else {
			expectType<{ C: true }>(result);
		}
	});

	it("should support an enum with possible undefined", () => {
		const result = ((): Enum<{
			A: { value: string };
			B: { value: number | undefined };
		}> => {
			if (Math.random()) {
				return { A: true, value: "a" };
			}
			return { B: true, value: 1 };
		})();
		if (result.A) {
			expectType<string>(result.value);
		} else {
			expectType<number | undefined>(result.value);
		}
	});

	it("should support an unknown generic variable type", () => {
		const result = (<T>(
			value: T
		): Enum<{
			A: { value: T };
			B: undefined;
		}> => {
			if (value) {
				return { A: true, value };
			}
			return { B: true };
		})(Math.random());
		if (result.A) {
			expectType<number>(result.value);
		} else {
			expectType<true>(result.B);
		}
	});

	describe("Keys", () => {
		it("should support Enum(0)", () => {
			const Empty = {};
			const $ = {} as Enum.Keys<Enum<typeof Empty>>;
			expectType<typeof $ extends never ? true : false>(true as const);
		});

		it("should support Enum(1)", () => {
			const $ = {} as Enum.Keys<Enum<{ A: undefined }>>;
			expectType<"A">($);
			expectType<typeof $ extends never ? true : false>(false as const);
		});

		it("should support Enum(n)", () => {
			const $ = {} as Enum.Keys<Enum<{ A: undefined; B: { value: string } }>>;
			expectType<"A" | "B">($);
		});
	});

	describe("Values", () => {
		it("should support Enum(0)", () => {
			const Empty = {};
			const $ = {} as Enum.Values<Enum<typeof Empty>>;
			expectType<typeof $ extends never ? true : false>(true as const);
		});

		it("should support Enum(1)", () => {
			const $ = {} as Enum.Values<
				Enum<{
					A: { value: string };
				}>
			>;
			expectType<{ value: string }>($);
			expectType<typeof $ extends never ? true : false>(false as const);
		});

		it("should support Enum(n)", () => {
			const $ = {} as Enum.Values<
				Enum<{
					A: { value: string };
					B: { value: number };
					C: undefined;
				}>
			>;
			expectType<{ value: string | number }>($);
			expectType<{ value: string } | { value: number }>($);
			expectType<typeof $ extends never ? true : false>(false as const);
		});
	});

	describe("Pick", () => {
		it("should support Enum(0)", () => {
			const Empty = {};
			const $ = {} as Enum.Pick<Enum<typeof Empty>, never>;
			expectType<typeof $ extends never ? true : false>(true as const);
		});

		it("should support Enum(1)", () => {
			const $ = {} as Enum.Pick<Enum<{ A: { value: string } }>, "A">;
			expectType<{ A: true; value: string }>($);
			expectType<typeof $ extends never ? true : false>(false as const);
		});

		it("should support Enum(n)", () => {
			const $ = {} as Enum.Pick<
				Enum<{ A: { value: string }; B: undefined }>,
				"A"
			>;
			expectType<{ A: true; B?: never; value: string }>($);
		});
	});

	describe("Omit", () => {
		it("should support Enum(0)", () => {
			const Empty = {};
			const $ = {} as Enum.Omit<Enum<typeof Empty>, never>;
			expectType<typeof $ extends never ? true : false>(true as const);
		});

		it("should support Enum(1)", () => {
			const $ = {} as Enum.Omit<Enum<{ A: { value: string } }>, "A">;
			expectType<typeof $ extends never ? true : false>(true as const);
		});

		it("should support Enum(n)", () => {
			const $ = {} as Enum.Omit<
				Enum<{ A: { value: string }; B: undefined }>,
				"A"
			>;
			expectType<{ B: true; A?: never }>($);
			// @ts-expect-error It should be wrong.
			expectType<{ A: true; B?: never }>($);
			expectType<typeof $ extends never ? true : false>(false as const);
		});
	});
});

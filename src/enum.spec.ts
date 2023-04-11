import { expectType } from "tsd";
import type { Enum } from "./enum";

describe("Enum", () => {
	it("should enforce object values in definintion", () => {
		// @ts-expect-error "string" in not assignable to "object".
		expectType<Enum<{ A: string }>>({ A: true });
		expectType<Enum<{ A: { value: string } }>>({ A: true, value: "foo" });
	});

	it("should support an enum of one", () => {
		const $ = ((): Enum<{
			A: { value: string };
		}> => {
			return { A: true, value: "a" };
		})();
		if ($.A) {
			expectType<string>($.value);
		} else {
			expectType<typeof $.A extends never ? true : false>(true as const);
		}
	});

	it("should support an enum of many", () => {
		const $ = ((): Enum<{
			A: { value: string };
			B: { value: number };
			C: undefined;
		}> => {
			if (Math.random()) {
				return { A: true, value: "a" };
			}
			return { B: true, value: 123 };
		})();
		if ($.A) {
			expectType<string>($.value);
		} else if ($.B) {
			expectType<number>($.value);
		} else {
			expectType<{ C: true }>($);
		}
	});

	it("should support an enum with possible undefined", () => {
		const $ = ((): Enum<{
			A: { value: string };
			B: { value: number | undefined };
		}> => {
			if (Math.random()) {
				return { A: true, value: "a" };
			}
			return { B: true, value: 1 };
		})();
		if ($.A) {
			expectType<string>($.value);
		} else {
			expectType<number | undefined>($.value);
		}
	});

	it("should support an unknown generic variable type", () => {
		const $ = (<T>(
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
		if ($.A) {
			expectType<number>($.value);
		} else {
			expectType<true>($.B);
		}
	});

	describe("Root", () => {
		const $ = {} as Enum.Root<
			Enum<{
				A: { value: string };
				B: { value: number };
				C: undefined;
			}>
		>;
		expectType<{
			A: { value: string };
			B: { value: number };
			C: undefined;
		}>($);
		expectType<typeof $ extends never ? true : false>(false as const);
	});

	describe("Merge", () => {
		type A = Enum<{ A1: undefined; A2: { foo: string } }>;
		type B = Enum<{ B1: undefined; B2: { bar: string } }>;
		const $ = {} as Enum.Merge<A | B>;
		expectType<
			| { A1: true; A2?: never; B1?: never; B2?: never }
			| { A1?: never; A2: true; B1?: never; B2?: never; foo: string }
			| { A1?: never; A2?: never; B1: true; B2?: never }
			| { A1?: never; A2?: never; B1?: never; B2: true; bar: string }
		>($);
		expectType<typeof $ extends never ? true : false>(false as const);
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
			expectType<typeof $ extends never ? true : false>(false as const);
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

import { expectType } from "tsd";
import { match } from "./match";
import type { Enum } from "../enum";

describe("match", () => {
	it("should handle handle and fallback matches", () => {
		const getValue = (
			value: Enum<{
				A: string;
				B: number;
				C: undefined;
				D: never;
				E: unknown;
			}>
		) =>
			match(value)(
				{
					A: (a) => a,
					B: (b) => b,
				},
				(value) => {
					if (value.E) {
						return undefined;
					} else {
						return value.C;
					}
				}
			);
		{
			const value = getValue({ A: { value: "foo" } });
			expectType<string | number | undefined | true>(value);
		}

		expect(getValue({ A: { value: "foo" } })).toBe("foo");
		expect(getValue({ B: { value: 123 } })).toBe(123);
		expect(getValue({ C: true })).toBe(true);
		expect(getValue({ E: { value: null } })).toBeUndefined();
	});
});

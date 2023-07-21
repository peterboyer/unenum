import type { Expect, Equal } from "./testutils";
import { match } from "./match";
import type { Enum } from "./enum";

describe("match", () => {
	type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

	test("match", () => {
		const doMatch = (foo: Foo) =>
			match(foo, {
				A: ({ is }) => is === "A",
				B: ({ b }) => b,
				C: ({ c }) => c,
			});

		() => {
			const result = doMatch({} as Foo);
			({}) as [Expect<Equal<typeof result, boolean | number | string>>];
		};

		expect(doMatch({ is: "A" })).toBe(true);
		expect(doMatch({ is: "B", b: "abc" })).toBe("abc");
		expect(doMatch({ is: "C", c: 12345 })).toBe(12345);
		expect(() => doMatch({} as Foo)).toThrow();
	});

	test("match.orUndefined", () => {
		const doMatch = (foo: Foo) =>
			match.orUndefined(foo, {
				B: ({ b }) => b,
				C: ({ c }) => c,
			});

		() => {
			const resultOrUndefined = doMatch({} as Foo);
			({}) as [
				Expect<Equal<typeof resultOrUndefined, number | string | undefined>>
			];
		};

		expect(doMatch({ is: "A" })).toBeUndefined();
		expect(doMatch({ is: "B", b: "abc" })).toBe("abc");
		expect(doMatch({ is: "C", c: 12345 })).toBe(12345);
		expect(doMatch({} as Foo)).toBeUndefined();
	});

	test("match.orDefault", () => {
		const doMatch = (foo: Foo) =>
			match.orDefault(
				foo,
				{
					B: ({ b }) => b,
					C: ({ c }) => c,
				},
				({ is }) => is
			);

		() => {
			const resultOrFallback = doMatch({} as Foo);
			({}) as [Expect<Equal<typeof resultOrFallback, number | string>>];
		};

		expect(doMatch({ is: "A" })).toBe("A");
		expect(doMatch({ is: "B", b: "abc" })).toBe("abc");
		expect(doMatch({ is: "C", c: 12345 })).toBe(12345);
		expect(doMatch({} as Foo)).toBeUndefined();
	});

	test("match.orDefault exhaustive", () => {
		const doMatch = (foo: Foo) =>
			match.orDefault(
				foo,
				{
					A: ({ is }) => is === "A",
					B: ({ b }) => b,
					C: ({ c }) => c,
				},
				($) => {
					({}) as [Expect<Equal<typeof $, unknown>>];
					return null;
				}
			);

		() => {
			const resultOrFallbackNever = doMatch({} as Foo);
			({}) as [
				Expect<
					Equal<typeof resultOrFallbackNever, null | boolean | number | string>
				>
			];
		};

		expect(doMatch({ is: "A" })).toBe(true);
		expect(doMatch({ is: "B", b: "abc" })).toBe("abc");
		expect(doMatch({ is: "C", c: 12345 })).toBe(12345);
		expect(doMatch({} as Foo)).toBeNull();
	});
});

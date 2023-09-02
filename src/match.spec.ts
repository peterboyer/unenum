import type { Expect, Equal } from "./testutils";
import { match, type Enum } from "./default";

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

	test("match.partial", () => {
		const doMatch = (foo: Foo) =>
			match.partial(foo, {
				B: ({ b }) => b,
				C: ({ c }) => c,
				_: () => undefined,
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
});

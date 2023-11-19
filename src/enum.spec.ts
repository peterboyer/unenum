import type { Expect, Equal } from "./shared/tests";
import { Enum } from "./enum";

describe("match", () => {
	type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

	test("full", () => {
		const doMatch = (foo: Foo) =>
			Enum.match(foo, {
				A: () => true,
				B: ({ b }) => b,
				C: ({ c }) => c,
			});

		() => {
			const result = doMatch({} as Foo);
			({}) as [Expect<Equal<typeof result, boolean | number | string>>];
		};

		expect(doMatch({ _type: "A" })).toBe(true);
		expect(doMatch({ _type: "B", b: "abc" })).toBe("abc");
		expect(doMatch({ _type: "C", c: 12345 })).toBe(12345);
		expect(() => doMatch({} as Foo)).toThrow();
	});

	test("full no args", () => {
		const doMatch = (foo: Foo) =>
			Enum.match(foo, {
				A: () => 12345,
				B: () => "abc",
				C: () => true,
			});

		() => {
			const result = doMatch({} as Foo);
			({}) as [Expect<Equal<typeof result, boolean | number | string>>];
		};

		expect(doMatch({ _type: "A" })).toBe(12345);
		expect(doMatch({ _type: "B", b: "abc" })).toBe("abc");
		expect(doMatch({ _type: "C", c: 12345 })).toBe(true);
		expect(() => doMatch({} as Foo)).toThrow();
	});

	test("partial", () => {
		const doMatch = (foo: Foo) =>
			Enum.match(foo, {
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

		expect(doMatch({ _type: "A" })).toBeUndefined();
		expect(doMatch({ _type: "B", b: "abc" })).toBe("abc");
		expect(doMatch({ _type: "C", c: 12345 })).toBe(12345);
		expect(doMatch({} as Foo)).toBeUndefined();
	});

	test("partial only", () => {
		const doMatch = (foo: Foo) =>
			Enum.match(foo, {
				_: () => undefined,
			});

		() => {
			const resultOrUndefined = doMatch({} as Foo);
			({}) as [Expect<Equal<typeof resultOrUndefined, undefined>>];
		};

		expect(doMatch({ _type: "A" })).toBeUndefined();
		expect(doMatch({ _type: "B", b: "abc" })).toBeUndefined();
		expect(doMatch({ _type: "C", c: 12345 })).toBeUndefined();
		expect(doMatch({} as Foo)).toBeUndefined();
	});
});

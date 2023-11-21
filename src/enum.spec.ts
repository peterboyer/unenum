import type { Expect, Equal } from "./shared/tests";
import { Enum } from "./enum";

describe("match", () => {
	type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

	test("full", () => {
		type Value =
			| { _type: "one" }
			| { _type: "two" }
			| { _type: "three" }
			| { _type: "four"; name: string }
			| { _type: "five"; count: number };

		const doMatch = (value: Value) =>
			Enum.match(value)({
				one: () => "one" as const,
				two: () => "two" as const,
				three: () => "three" as const,
				four: () => {
					return "four" as const;
				},
				five: ({ count }) => {
					void count;
					return "five" as const;
				},
				_: () => "fallback" as const,
				// TODO: Test strict match.
				// _: undefined,
			});

		() => {
			const result = doMatch({} as Value);
			({}) as [
				Expect<
					Equal<
						typeof result,
						"one" | "two" | "three" | "four" | "five" | "fallback"
					>
				>
			];
		};

		expect(doMatch({ _type: "one" })).toBe(true);
		expect(doMatch({ _type: "two", b: "abc" })).toBe("abc");
		expect(doMatch({ _type: "three", c: 12345 })).toBe(12345);
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

	test("with custom discriminant", () => {
		type ECustom = Enum<
			{
				A: true;
				B: { b: string };
				C: { c: number };
			},
			"custom"
		>;

		const doMatch = (value: ECustom) =>
			Enum.match.on("custom")(value, {
				B: ({ b }) => parseInt(b),
				_: () => undefined,
			});

		() => {
			const resultOrUndefined = doMatch({} as ECustom);
			({}) as [Expect<Equal<typeof resultOrUndefined, number | undefined>>];
		};

		expect(doMatch({ custom: "A" })).toBeUndefined();
		expect(doMatch({ custom: "B", b: "abc" })).toBeUndefined();
		expect(doMatch({ custom: "C", c: 12345 })).toBeUndefined();
		expect(doMatch({} as ECustom)).toBeUndefined();
	});
});

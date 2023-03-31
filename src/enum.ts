const Empty = {};
type Empty = typeof Empty;

/**
 * Creates a union of mutually exclusive, discriminable variants.
 *
 * @example
 * ```ts
 * type Foo = Enum<{
 *   A: { a: string };
 *   B: { b: number };
 *   C: undefined;
 * }>
 * -> | { A:  true ; B?: never; C?: never; a: string; }
 *    | { A?: never; B:  true ; C?: never; b: number; }
 *    | { A?: never; B?: never; C:  true ;            }
 *
 * const foo: Foo = { A: true, a: "abc" };
 * const foo: Foo = { B: true, b: 12345 };
 * const foo: Foo = { C: true,          };
 *
 * if      (foo.A) { foo.a; -> string }
 * else if (foo.B) { foo.b; -> number }
 * else            { ... }
 * ```
 */
// prettier-ignore
export type Enum<T extends Record<string, object | undefined>> = {
	[V in keyof T]-?:
		& (T[V] extends undefined ? Empty : T[V])
		& { [K in V]-?: true }
		& { [K in Exclude<keyof T, V>]+?: never };
}[keyof T];

export namespace Enum {
	/**
	 * Infers all possible variants keys of the given Enum.
	 *
	 * @example
	 * ```ts
	 * type Foo = Enum<{ A: { a: string }, B: { b: number }, C: undefined }>
	 * type FooKeys = Enum.Keys<Foo>
	 * -> "A" | "B" | "C"
	 * ```
	 */
	export type Keys<T extends object> = T extends unknown
		? { [K in keyof T]-?: T[K] extends true ? K : never }[keyof T]
		: never;

	/**
	 * Infers all possible variant values of the given Enum.
	 *
	 * @example
	 * ```ts
	 * type Foo = Enum<{ A: { a: string }, B: { b: number }, C: undefined }>
	 * type FooValues = Enum.Values<Foo>
	 * -> { a: string } | { b: string }
	 * ```
	 */
	export type Values<T extends object> = T extends unknown
		? Omit<T, Enum.Keys<T>> extends infer U
			? Empty extends U
				? never
				: U
			: never
		: never;

	/**
	 * Picks all given variants of the given Enum by variant keys.
	 *
	 * @example
	 * ```ts
	 * type Foo = Enum<{ A: { a: string }, B: { b: number }, C: undefined }>
	 * type FooPick = Enum.Pick<Foo, "A" | "C">
	 * -> { A: true, a: string } | { C: true }
	 * ```
	 */
	export type Pick<T extends object, V extends Enum.Keys<T>> = T extends (
		V extends unknown ? { [K in V]: true } : never
	)
		? T
		: never;
}

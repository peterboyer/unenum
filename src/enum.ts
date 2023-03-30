/**
 * Creates a union of mutually exclusive, discriminable variants.
 * Variants with a value (`: T`) will be wrapped in a truthy `{ value: T }` box.
 * Variants without a value (`?: void`) will be truthy as `true`.
 *
 * @example
 * ```
 * type Foo = Enum<{
 *   A: { x: string };
 *   B: { y: number };
 *   C: undefined;
 * }>
 * -> | { A:  true ; B?: never; C?: never; x: string; }
 *    | { A?: never; B:  true ; C?: never; y: number; }
 *    | { A?: never; B?: never; C:  true ;            }
 *
 * const foo: Foo = { A: true, x: "abc" };
 * const foo: Foo = { B: true, y: 12345 };
 * const foo: Foo = { C: true,          };
 *
 * if      (foo.A) { foo.x; -> string }
 * else if (foo.B) { foo.y; -> number }
 * else            { ... }
 * ```
 */
// prettier-ignore
export type Enum<T extends Record<string, object | undefined>> = {
	[V in keyof T]-?:
		& (T[V] extends undefined ? object : T[V])
		& { [K in V]-?: true }
		& { [K in Exclude<keyof T, V>]+?: never };
}[keyof T];

export namespace Enum {
	export type Keys<T extends object> = T extends unknown
		? { [K in keyof T]-?: T[K] extends true ? K : never }[keyof T]
		: never;

	export type Values<T extends object> = T extends unknown
		? Omit<T, Enum.Keys<T>>
		: never;

	export type Pick<T extends object, V extends Enum.Keys<T>> = T extends (
		V extends unknown ? { [K in V]: true } : never
	)
		? T
		: never;
}

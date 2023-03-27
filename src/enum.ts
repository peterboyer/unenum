/// <reference path="utils.d.ts" />
import type { RequiredKeys, Intersect } from "./utils";

/**
 * Creates a union of mutually exclusive, discriminable variants.
 * Variants with a value (`: T`) will be wrapped in a truthy `{ value: T }` box.
 * Variants without a value (`?: void`) will be truthy as `true`.
 *
 * @example
 * ```
 * type Foo = Enum<{ A: string; B: number; C?: void; }>
 * -> | { A: { value: string }; B?: never;            C?: never; }
 *    | { A?: never;            B: { value: number }; C?: never; }
 *    | { A?: never;            B?: never;            C: true;   }
 *
 * const foo: Foo = { A: { value: "abc" } };
 * const foo: Foo = { B: { value: 123   } };
 * const foo: Foo = { C: true             };
 *
 * if (foo.A)      { foo.A.value; -> string }
 * else if (foo.B) { foo.B.value; -> number }
 * else            { foo.C;       -> true   }
 * ```
 */
// prettier-ignore
type Enum<T extends object> = {
	[K in keyof T]-?:
		& { [M in K]-?: K extends RequiredKeys<T> ? { value: T[K] } : true }
		& { [M in Exclude<keyof T, K>]+?: never };
}[keyof T];

namespace Enum {
	/**
	 * Infers a given Enum's root definition, from which a variants' value type
	 * may be further inferred.
	 *
	 * @example
	 * ```
	 * type FooRoot = Infer<Enum<{ A: string | number; B?: void; }>>
	 * -> { A: string | number; B?: void; }
	 *
	 * FooRoot["A"] -> :-? string | number
	 * FooRoot["B"] -> :+? void | undefined
	 * ```
	 */
	export type Infer<T extends object> = Intersect<
		T extends unknown ? InferRoots<Pick<T, RequiredKeys<T>>> : never
	>;

	type InferRoots<T> = {
		[K in keyof T]: T[K] extends { value: infer R }
			? { [M in K]-?: R }
			: { [M in K]+?: void };
	}[keyof T];
}

export type { Enum };

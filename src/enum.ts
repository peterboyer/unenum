// prettier-ignore
/**
 * Creates a union of mutually exclusive, discriminable variants.
 * Variants with a value are wrapped in a truthy { value: ... } box.
 * Variants without a value (`undefined`) must also be truthy as `true`.
 *
 * @example
 * ```
 * Enum<{ A: string; B: number; C: undefined }>
 * -> | { A: { value: string }; B?: never; C?: never; }
 *    | { A?: never; B: { value: number }; C?: never; }
 *    | { A?: never; B?: never; C: true; }
 * ```
 *
 * In the case of generic variant values that aren't known at definition,
 * (e.g. a function with a generic type), you must wrap the enum variant's value
 * with `Enum.Generic<T>` to enforce a return type as a { value: ... } box.
 *
 * @example ```
 * // BROKEN
 * function<T>(value: T): Enum<{ A: T, B: undefined }> {
 *   return { A: { value } }
 *            ^ Type '{ value: T }' is not assignable ...
 * }
 *
 * // CORRECT
 * function<T>(value: T): Enum<{ A: Enum.Generic<T>, B: undefined }> {
 *                                  ^ Wrapping the unknown generic.
 *   return { A: { value } }
 *            ^ Fixed!
 * }
 * ```
 */
type Enum<T extends object> = {
	[K in keyof T]:
		& { [M in K]: T[K] extends Enum.Generic<unknown>
			? { value: T[K]["$"] }
			: T[K] extends undefined ? true : { value: T[K] }
		}
		& { [M in Exclude<keyof T, K>]?: never };
}[keyof T];

namespace Enum {
	/**
	 * Helper to coerce unknown generic values to use a { value: ... } box.
	 * Refer to the Enum<T> type for example of usage with a generic function.
	 */
	export type Generic<T> = { $: T };

	/**
	 * Helper to infer an enum's variant's value.
	 *
	 * @example
	 * ```
	 * Infer<Enum<{ A: string; B: undefined }>, "A">
	 * -> string
	 * Infer<Enum<{ A: string; B: undefined }>, "B">
	 * -> undefined
	 * ```
	 */
	export type Infer<T extends object, K extends keyof T> = T extends Record<
		K,
		infer R
	>
		? R extends { value: infer V }
			? V
			: undefined
		: never;

	export type Root<T extends object> = UnboxValues<
		Intersect<T extends unknown ? Pick<T, RequiredKeys<T>> : never>
	>;

	/**
	 * Get unboxed value if boxed, otherwise, it's undefined.
	 *
	 * @example
	 * ```
	 * UnboxValues<{ A: { value: string }; B: true }>
	 * -> { A: string, B: undefined }
	 * ```
	 */
	type UnboxValues<T> = {
		[K in keyof T]: T[K] extends { value: infer R } ? R : undefined;
	};

	/**
	 * Create an intersection of all union members.
	 *
	 * @example
	 * ```
	 * Intersect<{ A: string } | { B: string } | { C: string }>
	 * -> { A: string, B: string, C: string }
	 * ```
	 */
	type Intersect<T extends object> = (
		T extends unknown ? (t: T) => void : never
	) extends (t: infer R) => void
		? R
		: never;

	/**
	 * Get all "required" keys of object.
	 *
	 * @example
	 * ```
	 * RequiredKeys<{ A: string; B: string; C?: string }>
	 * -> "A" | "B"
	 * ```
	 */
	type RequiredKeys<T extends object> = {
		// eslint-disable-next-line @typescript-eslint/ban-types
		[K in keyof T]-?: {} extends Pick<T, K> ? never : K;
	}[keyof T];
}

export type { Enum };

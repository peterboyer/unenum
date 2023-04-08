const Empty = {};
export type Empty = typeof Empty;

/**
 * Infers all possible variants keys of the given Enum.
 *
 * @example
 * ```ts
 * type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
 * type FooKeys = Enum.Keys<Foo>;
 * -> "A" | "B" | "C"
 * ```
 */
type EnumKeys<T extends object> = T extends unknown
	? { [K in keyof T]-?: T[K] extends true ? K : never }[keyof T]
	: never;

export type { EnumKeys as Keys };

/**
 * Infers all possible variant values of the given Enum.
 *
 * @example
 * ```ts
 * type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
 * type FooValues = Enum.Values<Foo>;
 * -> { a: string } | { b: string }
 * ```
 */
type EnumValues<T extends object> = T extends unknown
	? Omit<T, EnumKeys<T>> extends infer U
		? Empty extends U
			? never
			: U
		: never
	: never;

export type { EnumValues as Values };

/**
 * Narrows a given Enum by including only the given variant keys.
 *
 * @example
 * ```ts
 * type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
 * type FooPick = Enum.Pick<Foo, "A" | "C">;
 * -> { A: true; a: string } | { C: true }
 * ```
 */
export type EnumPick<T extends object, V extends EnumKeys<T>> = T extends (
	V extends unknown ? { [K in V]: true } : never
)
	? T
	: never;

export type { EnumPick as Pick };

/**
 * Narrows a given Enum by excluding only the given variant keys.
 *
 * @example
 * ```ts
 * type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
 * type FooOmit = Enum.Omit<Foo, "A" | "C">;
 * -> { B: true; b: number }
 * ```
 */
export type EnumOmit<T extends object, V extends EnumKeys<T>> = T extends (
	V extends unknown ? { [K in V]: true } : never
)
	? never
	: T;

export type { EnumOmit as Omit };

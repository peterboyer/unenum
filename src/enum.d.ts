/**
Creates a union of mutually exclusive, discriminable variants.

```ts
type Foo = Enum<{
	A: { a: string };
	B: { b: number };
	C: undefined;
}>;
-> | { is: "A"; a: string }
   | { is: "B"; b: number }
   | { is: "C"            }
```
 */
// prettier-ignore
export type Enum<TVariants extends Record<string, object | undefined>> = {
	[Variant in keyof TVariants]-?: Identity<
		& { is: Variant }
		& (TVariants[Variant] extends undefined ? Empty : TVariants[Variant])
	>;
}[keyof TVariants];

export namespace Enum {
	export type { EnumKeys as Keys };
	export type { EnumValues as Values };
	export type { EnumPick as Pick };
	export type { EnumOmit as Omit };
}

// @ts-expect-error It's okay for this .d.ts file to have this const.
const Empty = {};
type Empty = typeof Empty;

/**
 * Merges intersections.
 *
 * @example
 * ```
 * Identity<{ is: "Data" } & { value: string }>
 * -> { is: "Data"; value: string }
 * ```
 */
// https://stackoverflow.com/a/49683575
type Identity<T> = T extends object ? { [K in keyof T]: T[K] } : never;

/**
Infers all possible variants keys of the given Enum.

```ts
type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
Enum.Keys<Foo>
-> "A" | "B" | "C"
```
 */
type EnumKeys<TEnum> = TEnum extends { is: string } ? TEnum["is"] : never;

/**
Infers all possible variant values of the given Enum.

```ts
type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
Enum.Values<Foo>
-> | { a: string }
   | { b: string }
```
 */
type EnumValues<TEnum> = TEnum extends { is: string }
	? Omit<TEnum, "is"> extends infer Values
		? keyof Values extends never
			? never
			: Values
		: never
	: never;

/**
Narrows a given Enum by including only the given variant keys.

```ts
type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
Enum.Pick<Foo, "A" | "C">
-> | { is: "A"; a: string }
   | { is: "C" }
```
 */
type EnumPick<TEnum, TVariant extends EnumKeys<TEnum>> = TEnum extends {
	is: TVariant;
}
	? TEnum
	: never;

/**
Narrows a given Enum by excluding only the given variant keys.

```ts
type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
Enum.Omit<Foo, "A" | "C">
-> | { is: "B"; b: number }
```
 */
type EnumOmit<TEnum, TVariant extends EnumKeys<TEnum>> = TEnum extends {
	is: TVariant;
}
	? never
	: TEnum;

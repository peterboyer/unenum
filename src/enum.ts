/**
Creates a union of mutually exclusive, discriminable variants.

```ts
import "unenum/global.enum"; // global
import type { Enum } from "unenum"; // imported

// Default
type Foo = Enum<{
  A: true;
  B: { b: string };
  C: { c: number };
}>;
-> | { is: "A" }
   | { is: "B"; b: string }
   | { is: "C"; c: number }

// Enum with Custom Discriminant
type MyFoo = Enum<{
  A: true;
  B: { b: string };
  C: { c: number };
}, "$key">;
-> | { $key: "A" }
   | { $key: "B"; b: string }
   | { $key: "C"; c: number }

// Enum Generic with Custom Discriminant
import type { EnumVariants } from "unenum"
type MyEnum<TVariants extends EnumVariants> = Enum<TVariants, "$key">
```
*/
export type Enum<
	TVariants extends EnumVariants,
	TDiscriminant extends EnumDiscriminant = EnumDiscriminantDefault
> = {
	// prettier-ignore
	[TVariantKey in keyof TVariants]-?:
		TVariants[TVariantKey] extends true
			? EnumVariantUnit<TVariantKey & string, TDiscriminant>
		: TVariants[TVariantKey] extends Record<string, unknown>
			? EnumVariantData<TVariantKey & string, TVariants[TVariantKey], TDiscriminant>
		: never;
}[keyof TVariants];

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Enum {
	// @ts-expect-error Should work.
	export type {
		EnumPick as Pick,
		EnumOmit as Omit,
		EnumMerge as Merge,
		EnumExtend as Extend,
		EnumUnwrap as Unwrap,
		EnumKeys as Keys,
		EnumValues as Values,
		EnumProps as Props,
	};
}

export type EnumVariants = Record<string, true | Record<string, unknown>>;
export type EnumDiscriminant = string;
export type EnumDiscriminantDefault = "is";

export type EnumVariantUnit<
	TKey extends string,
	TDiscriminant extends EnumDiscriminant = EnumDiscriminantDefault
> = Identity<{ [TDiscriminantKey in TDiscriminant]: TKey }>;

export type EnumVariantData<
	TKey extends string,
	TData extends Record<string, unknown>,
	TDiscriminant extends EnumDiscriminant = EnumDiscriminantDefault
> = Identity<{ [TDiscriminantKey in TDiscriminant]: TKey } & TData>;

/**
Narrows a given Enum by including only the given variants by key.

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Pick<Foo, "A" | "C">
-> | { is: "A" }
   | { is: "C"; c: number }
```
 */
type EnumPick<TEnum, TVariantKeys extends EnumKeys<TEnum>> = TEnum extends {
	is: TVariantKeys;
}
	? TEnum
	: never;

/**
Narrows a given Enum by excluding only the given variants by key.

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Omit<Foo, "A" | "C">
-> | { is: "B"; b: string }
```
 */
type EnumOmit<TEnum, TVariantKeys extends EnumKeys<TEnum>> = TEnum extends {
	is: TVariantKeys;
}
	? never
	: TEnum;

/**
Merges a union of Enums' variants and properties into a new Enum.

```ts
type Foo = Enum<{ A: true; B: true; C: { c1: string } }>;
type Bar = Enum<{ B: { b1: string }; C: { c2: number }; D: true }>;

Enum.Merge<Foo | Bar>
-> Enum<{
  A: true;
  B: { b1: string };
  C: { c1: string; c2: number };
  D: true;
}>
```
*/
type EnumMerge<TEnums> = Enum<
	TrueOrObj<
		Intersect<TrueAsEmpty<TEnums extends unknown ? EnumUnwrap<TEnums> : never>>
	>
>;
type TrueAsEmpty<T> = {
	[K in keyof T]: T[K] extends true ? Record<never, never> : T[K];
};
type TrueOrObj<T> = {
	[K in keyof T]: keyof T[K] extends never ? true : Identity<T[K]>;
};

/**
Merges new additional variants and properties into a new Enum.

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Extend<Foo, { D: true }>
-> Enum<{
  A: true;
  B: { b: string };
  C: { c: number };
  D: true;
}>
```
 */
type EnumExtend<TEnum, TVariants extends EnumVariants> = EnumMerge<
	TEnum | Enum<TVariants>
>;

/**
Infers all variants' unit and data definitions of the given Enum.

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Unwrap<Foo>
-> | { A: true; B: { b: string }; C: { c: number } }
```
 */
type EnumUnwrap<TEnum> = Identity<
	Intersect<
		TEnum extends { is: string }
			? {
					[key in TEnum["is"]]: Exclude<keyof TEnum, "is"> extends never
						? true
						: Identity<Omit<TEnum, "is">>;
			  }
			: never
	>
>;

/**
Infers all variants' keys of the given Enum.

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Keys<Foo>
-> "A" | "B" | "C"
```
 */
type EnumKeys<TEnum> = TEnum extends { is: string } ? TEnum["is"] : never;

/**
Infers all variants' values of the given Enum.

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Values<Foo>
-> | { b: string }
   | { c: number }
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
Infers only mutual variants' properties' names of the given Enum. If `TAll` is
`true`, then all variants' properties' names are inferred.

```ts
type Foo = Enum<{ A: true; B: { x: string }; C: { x: string; y: number } }>;

Enum.Props<Foo>
-> "x" // only `x` is mutual in both B and C

Enum.Props<Foo, true>
-> "x" | "y" // now `y` is included because `TAll` is `true`
```
 */
type EnumProps<TEnum, TAll extends boolean = false> = [TEnum] extends [never]
	? never
	: TAll extends true
	? TEnum extends unknown
		? keyof Omit<TEnum, "is">
		: never
	: [TEnum] extends [{ is: string }]
	? keyof Intersect<Omit<TEnum, "is">>
	: never;

/**
@internal

Merges intersections.

@example
```
Identity<{ is: "Data" } & { value: string }>
-> { is: "Data"; value: string }
```
 */
// https://stackoverflow.com/a/49683575
type Identity<T> = T extends object ? { [K in keyof T]: T[K] } : never;

/**
@internal

Create an intersection of all union members.

```
Intersect<{ A: string } | { B: string } | { C: string }>
-> { A: string, B: string, C: string }
```
 */
type Intersect<T> = (T extends unknown ? (t: T) => void : never) extends (
	t: infer R
) => void
	? R
	: never;

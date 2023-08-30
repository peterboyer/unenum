import * as unenum from "./enum";

type Discriminant = "is";

// prettier-ignore
export type Enum<TVariants extends unenum.EnumVariants> = unenum.Enum<Discriminant, TVariants>;

// prettier-ignore
export namespace Enum {
	export type Keys<TEnum> = unenum.EnumKeys<Discriminant, TEnum>;
	export type Unwrap<TEnum> = unenum.EnumUnwrap<Discriminant, TEnum>;
	export type Pick<TEnum, TKeys extends unenum.EnumKeys<Discriminant, TEnum>> = unenum.EnumPick<Discriminant, TEnum, TKeys>;
	export type Omit<TEnum, TKeys extends unenum.EnumKeys<Discriminant, TEnum>> = unenum.EnumOmit<Discriminant, TEnum, TKeys>;
	export type Merge<TEnums> = unenum.EnumMerge<Discriminant, TEnums>;
	export type Extend<TEnum, TEnums extends unenum.EnumVariants> = unenum.EnumExtend<Discriminant, TEnum, TEnums>;
}

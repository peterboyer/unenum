import type { Enum } from "../enum";

export type Keys<
	TEnum,
	TDiscriminant extends Enum.Discriminant = Enum.Discriminant.Default
> = TEnum extends Record<TDiscriminant, string> ? TEnum[TDiscriminant] : never;

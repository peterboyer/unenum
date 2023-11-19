import type { DiscriminantAny, DiscriminantDefault } from "./enum";

export type Keys<
	TEnum,
	TDiscriminant extends DiscriminantAny = DiscriminantDefault
> = TEnum extends Record<TDiscriminant, string> ? TEnum[TDiscriminant] : never;

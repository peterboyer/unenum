import type { DiscriminantAny, DiscriminantDefault } from "./enum";
import type { Keys } from "./keys";

export type Pick<
	TEnum,
	TKeys extends Keys<TEnum, TDiscriminant>,
	TDiscriminant extends DiscriminantAny = DiscriminantDefault
> = Extract<TEnum, Record<TDiscriminant, TKeys>>;

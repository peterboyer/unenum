import type { DiscriminantAny, DiscriminantDefault } from "./enum";
import type { Keys } from "./keys";

export type Omit<
	TEnum,
	TKeys extends Keys<TEnum, TDiscriminant>,
	TDiscriminant extends DiscriminantAny = DiscriminantDefault
> = Exclude<TEnum, Record<TDiscriminant, TKeys>>;

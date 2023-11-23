import type { Enum } from "../enum";
import type { Keys } from "./keys";

export type Omit<
	TEnum,
	TKeys extends Keys<TEnum, TDiscriminant>,
	TDiscriminant extends Enum.Discriminant = Enum.Discriminant.Default
> = Exclude<TEnum, Record<TDiscriminant, TKeys>>;

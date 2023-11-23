import type { Enum } from "../enum";
import type { Keys } from "./keys";

export type Pick<
	TEnum,
	TKeys extends Keys<TEnum, TDiscriminant>,
	TDiscriminant extends Enum.Discriminant = Enum.Discriminant.Default
> = Extract<TEnum, Record<TDiscriminant, TKeys>>;

import type { Enum } from "../enum";
import type { Infer } from "./infer";
import type { Identity } from "./shared/identity";
import type { Intersect } from "./shared/intersect";

export type Merge<
	TEnums,
	TDiscriminant extends Enum.Discriminant = Enum.Discriminant.Default
> = Enum<
	TrueOrObj<
		Intersect<
			TrueAsEmpty<TEnums extends unknown ? Infer<TEnums, TDiscriminant> : never>
		>
	>,
	TDiscriminant
>;

type TrueOrObj<T> = {
	[K in keyof T]: keyof T[K] extends never ? true : Identity<T[K]>;
};

type TrueAsEmpty<T> = {
	[K in keyof T]: T[K] extends true ? Record<never, never> : T[K];
};

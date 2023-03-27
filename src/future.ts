import type { Enum } from "./enum";

// https://doc.rust-lang.org/std/future/trait.Future.html
// https://doc.rust-lang.org/std/task/enum.Poll.html
export type Future<T = unknown> = Enum<{
	Ready: T;
	Pending?: void;
}>;

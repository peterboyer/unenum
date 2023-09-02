import type { Enum, EnumDiscriminant } from "./enum";

/**
Represents either a success `value` (`Ok`) or a failure `error` (`Error`).

```ts
import "unenum/global.result"; // global
import type { Result } from "unenum"; // imported

Result
-> | { is: "Ok" }
   | { is: "Error" }

Result<number>
-> | { is: "Ok"; value: number }
   | { is: "Error" }

Result<number, "FetchError" | "ConnectionError">
-> | { is: "Ok"; value: number }
   | { is: "Error"; error: "FetchError" | "ConnectionError" }

Result<
  number,
  Enum<{
    "FetchError": true;
    "ConnectionError": true;
    "FormFieldsError": { fieldErrors: Record<string, string> };
  }>
-> | { is: "Ok"; value: number }
   | { is: "Error"; error: | { is: "FetchError" }
                           | { is: "ConnectionError" }
                           | { is: "FormFieldsError"; fieldErrors: ... }}
```

```ts
const getUser = async (name: string): Promise<Result<User, "NotFound">> => {
  return { is: "Ok", value: user };
  return { is: "Error", error: "NotFound" };
}

const $user = await getUser("foo");
if ($user.is === "Error") { return ... }
const user = $user.value;

const $user = await getUser("foo");
const userOrUndefined = $user.is === "Ok" ? $user.value : undefined;

const $user = await getUser("foo");
const userOrDefault = $user.is === "Ok" ? $user.value : defaultUser;
```

Based on Rust's
[`Result`](https://doc.rust-lang.org/std/result/enum.Result.html) enum.
 */
export type Result<
	TDiscriminant extends EnumDiscriminant,
	TValue = never,
	TError = never
> = Enum<
	TDiscriminant,
	{
		Ok: [TValue] extends [never] ? true : { value: TValue };
		Error: [TError] extends [never] ? true : { error: TError };
	}
>;

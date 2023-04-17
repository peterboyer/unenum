import type { Enum, Future, Result } from "unenum";
import { safely } from "unenum";

type MyEnum = Enum<{
	A: undefined;
	B: { b: string };
}>;

{
	const result = ((value: string): Result<MyEnum, "ValueInvalid"> => {
		if (!value) {
			return { Err: true, error: "ValueInvalid" };
		}
		if (value === "a") {
			return { Ok: true, value: { A: true } };
		}
		return { Ok: true, value: { B: true, b: "..." } };
	})("foo");
	if (result.Err) {
		console.log(result.error === "ValueInvalid");
	} else {
		if (result.value.A) {
			console.log(result.value.A === true);
		} else {
			console.log(result.value.b === "...");
		}
	}
	const $data = safely(() => JSON.parse(""));
	if ($data.Err) {
		console.log($data.error);
	} else {
		console.log($data.value);
	}

	const useUser = (): Future<Result<number, "DataError">> => {
		return { Pending: true };
	};
	const $user = useUser();
	if ($user.Pending) {
		console.log("pending");
	} else if ($user.Err) {
		console.log($user.error);
	}
}

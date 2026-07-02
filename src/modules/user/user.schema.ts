import { t } from "elysia";

export const UserSchema = {
	LoginBody: t.Object({
		username: t.String(),
		password: t.String(),
	}),
	LoginResponse: t.Object({
		code: t.Number(),
		message: t.String(),
		data: t.Optional(
			t.Object({
				token: t.String(),
			}),
		),
	}),
};

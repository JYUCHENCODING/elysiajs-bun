import { t } from "elysia";

export const CreateUserDTO = t.Object({
	username: t.String({ minLength: 3, maxLength: 20 }),
	password: t.String({ minLength: 6, maxLength: 50 }),
});

export const UpdateUserDTO = t.Partial(CreateUserDTO);

export const UserResponseDTO = t.Object({
	id: t.String(),
	username: t.String(),
});

export const LoginDTO = t.Object({
	username: t.String(),
	password: t.String(),
});

export const LoginResponseDTO = t.Object({
	code: t.Number(),
	message: t.String(),
	data: t.Optional(
		t.Object({
			token: t.String(),
		}),
	),
});

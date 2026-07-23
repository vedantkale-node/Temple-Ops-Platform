import { AppError } from "@/errors/AppError";
import { HTTP_CODES, MESSAGE, ROLES } from "@/constants";
import { generateVerificationToken, sendEmail } from "@/utils";
import { CreateUserDto, UpdateUserDto } from "./users.validator";
import { User } from "./users.model";

export const createUser = async (data: CreateUserDto) => {
  const existing = await User.findOne({
    $or: [{ email: data.email }, { username: data.username }],
  });
  if (existing) {
    if (existing.email === data.email) {
      throw new AppError(
        MESSAGE.USER.EMAIL_ALREADY_EXISTS,
        HTTP_CODES.CONFLICT,
      );
    }
    throw new AppError(
      MESSAGE.USER.USERNAME_ALREADY_EXISTS,
      HTTP_CODES.CONFLICT,
    );
  }

  const token = generateVerificationToken();
  const emailVerificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
  const userData = { ...data, token, emailVerificationExpires };
  const user = await User.create(userData);

  const verifyUrl = `${MESSAGE.URL.VERIFY_EMAIL}${token}`;

  await sendEmail(
    data.email,
    "Verify Email",
    `<a href="${verifyUrl}">Verify your email</a>`,
  );
  const {
    password,
    token: _,
    ...safeUser
  } = user.toObject({ versionKey: false });
  return safeUser;
};

export const getUsers = async (page: number, limit: number) => {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.max(limit, 1);
  const skip = (safePage - 1) * safeLimit;

  const users = await User.find({}, { __v: 0 })
    .skip(skip)
    .limit(safeLimit)
    .lean();

  const total = await User.countDocuments();
  const pages = Math.ceil(total / safeLimit);
  return { users, total, page: safePage, pages };
};

export const softDeleteUser = async (id: string) => {
  const user = await User.findOneAndUpdate(
    { _id: id, deleted: false },
    {
      $set: {
        deleted: true,
        deletedAt: new Date(),
      },
    },
    { new: true },
  ).lean();
  if (!user)
    throw new AppError(
      MESSAGE.USER.USER_NOT_FOUND_OR_ALREADY_DELETED,
      HTTP_CODES.NOT_FOUND,
    );
  return user;
};

export const forceDeleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id).lean();
  if (!user)
    throw new AppError(MESSAGE.USER.USER_NOT_FOUND, HTTP_CODES.NOT_FOUND);
  return user;
};

export const restoreDeletedUser = async (id: string) => {
  const user = await User.findOneAndUpdate(
    { _id: id, deleted: true },
    { $set: { deleted: false }, $unset: { deletedAt: "" } },
    { new: true },
  ).lean();
  if (!user)
    throw new AppError(
      MESSAGE.USER.USER_NOT_FOUND_OR_NOT_DELETED,
      HTTP_CODES.NOT_FOUND,
    );
  return user;
};

export const updateUser = async (
  id: string,
  payload: UpdateUserDto,
  actorRole: string,
) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(MESSAGE.USER.USER_NOT_FOUND, HTTP_CODES.NOT_FOUND);
  }

  if (user.deleted && actorRole !== ROLES.SUPERADMIN) {
    throw new AppError(
      MESSAGE.USER.CANNOT_UPDATE_A_DELETED_USER,
      HTTP_CODES.BAD_REQUEST,
    );
  }

  if (payload.username) {
    const normalizedUsername = payload.username.trim().toLowerCase();

    if (user.username === normalizedUsername) {
      throw new AppError(
        MESSAGE.USER.USERNAME_MUST_BE_DIFFERENT,
        HTTP_CODES.CONFLICT,
      );
    }

    const exists = await User.exists({
      username: normalizedUsername,
      _id: { $ne: id },
    });

    if (exists) {
      throw new AppError(
        MESSAGE.USER.USERNAME_ALREADY_EXISTS,
        HTTP_CODES.CONFLICT,
      );
    }
    user.username = normalizedUsername;
  }

  const { username, ...rest } = payload;
  Object.assign(user, rest);
  await user.save();
  return user.toObject({ versionKey: false });
};

export const updateUserPass = async (
  id: string,
  oldPassword: string,
  newPassword: string,
  actorRole: string,
) => {
  const user = await User.findOne({ _id: id, deleted: false }).select(
    "+password",
  );

  if (!user)
    throw new AppError(MESSAGE.USER.USER_NOT_FOUND, HTTP_CODES.NOT_FOUND);

  if (user.deleted && actorRole !== ROLES.SUPERADMIN) {
    throw new AppError(
      MESSAGE.USER.CANNOT_UPDATE_PASSWORD_OF_DELETED_USER,
      HTTP_CODES.BAD_REQUEST,
    );
  }

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch)
    throw new AppError(
      MESSAGE.USER.INVALID_CURRENT_PASSWORD,
      HTTP_CODES.BAD_REQUEST,
    );

  const isSame = await user.comparePassword(newPassword);
  if (isSame)
    throw new AppError(
      MESSAGE.USER.NEW_PASSWORD_CANNOT_BE_SAME_AS_OLD_PASSWORD,
      HTTP_CODES.BAD_REQUEST,
    );
  user.password = newPassword;

  await user.save();
  const userObj = user.toObject({ versionKey: false });
  const { password, ...safeUser } = userObj;
  return safeUser;
};

export const updateUserEmail = async (
  id: string,
  email: string,
  actorRole: string,
  actorId: string,
) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findById(id);

  if (!user) {
    throw new AppError(MESSAGE.USER.USER_NOT_FOUND, HTTP_CODES.NOT_FOUND);
  }

  if (user.deleted && actorRole !== ROLES.SUPERADMIN) {
    throw new AppError(
      MESSAGE.USER.CANNOT_UPDATE_EMAIL_OF_DELETED_USER,
      HTTP_CODES.BAD_REQUEST,
    );
  }

  if (actorRole === ROLES.USER && actorId !== id) {
    throw new AppError(
      MESSAGE.USER.YOU_CAN_ONLY_SET_YOUR_OWN_EMAIL,
      HTTP_CODES.FORBIDDEN,
    );
  }

  if (user.email === normalizedEmail) {
    throw new AppError(
      MESSAGE.USER.EMAIL_MUST_BE_DIFFERENT_FROM_CURRENT_EMAIL,
      HTTP_CODES.CONFLICT,
    );
  }

  const existingUser = await User.exists({
    email: normalizedEmail,
    _id: { $ne: id },
  });

  if (existingUser) {
    throw new AppError(MESSAGE.USER.EMAIL_ALREADY_EXISTS, HTTP_CODES.CONFLICT);
  }

  user.email = normalizedEmail;

  await user.save();

  return user;
};

export const verifyEmail = async (token: string) => {
  const user = await User.findOne({ token, deleted: false }).select(
    "+token +emailVerificationExpires",
  );
  if (!user)
    throw new AppError(MESSAGE.AUTH.INVALID_TOKEN, HTTP_CODES.BAD_REQUEST);
  if (
    !user.emailVerificationExpires ||
    user.emailVerificationExpires < new Date()
  ) {
    throw new AppError(MESSAGE.AUTH.TOKEN_EXPIRED, HTTP_CODES.BAD_REQUEST);
  }
  user.verified = true;
  user.token = undefined;
  user.isTokenUsed = true;
  user.emailVerificationExpires = null;
  await user.save();
  return user.toObject({ versionKey: false });
};

export const me = async (id: string) => {
  const user = await User.findById(id)
    .select(
      "-emailVerificationExpires -isTokenUsed -deleted -deletedAt -createdAt -updatedAt -__v -pendingEmail",
    )
    .lean();

  if (!user) {
    throw new AppError(MESSAGE.USER.USER_NOT_FOUND, HTTP_CODES.NOT_FOUND);
  }
  return user;
};

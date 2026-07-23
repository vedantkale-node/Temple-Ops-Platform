import { me } from "../users.service";
import { User } from "../users.model";
import { MESSAGE } from "../../../constants/messages";

jest.mock("../users.model");

describe("me", () => {
  const mockUser = {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    role: "admin",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns the authenticated user's profile", async () => {
    const leanMock = jest.fn().mockResolvedValue(mockUser);
    const selectMock = jest.fn().mockReturnValue({ lean: leanMock });
    (User.findById as jest.Mock).mockReturnValue({ select: selectMock });

    const result = await me("user123");

    expect(User.findById).toHaveBeenCalledWith("user123");
    expect(result).toEqual(mockUser);
  });

  it("does not return sensitive fields", async () => {
    const leanMock = jest.fn().mockResolvedValue(mockUser);
    const selectMock = jest.fn().mockReturnValue({ lean: leanMock });
    (User.findById as jest.Mock).mockReturnValue({ select: selectMock });

    await me("user123");

    expect(selectMock).toHaveBeenCalledWith(
      "-emailVerificationExpires -isTokenUsed -deleted -deletedAt -createdAt -updatedAt -__v -pendingEmail",
    );
  });

  it("throws USER_NOT_FOUND if the user does not exist", async () => {
    const leanMock = jest.fn().mockResolvedValue(null);
    const selectMock = jest.fn().mockReturnValue({ lean: leanMock });
    (User.findById as jest.Mock).mockReturnValue({ select: selectMock });

    await expect(me("nonexistent")).rejects.toThrow(
      MESSAGE.USER.USER_NOT_FOUND,
    );
  });
});

export const MESSAGE = {
  AUTH: {
    LOGIN_SUCCESS: "Login successful",
    LOGOUT_SUCCESS: "Logout successful",
    INVALID_CREDENTIALS: "Invalid login credentials",
    INVALID_TOKEN: "Invalid",
    TOKEN_EXPIRED: "Token expired",
  },
  USER: {
    EMAIL_ALREADY_EXISTS: "Email already exists",
    EMAIL_SENT_SUCCESS: "Eamil sent successfully",
    EMAIL_SEND_ERROR: "Error while sending email",
    USERNAME_ALREADY_EXISTS: "Username already exists",
    USERNAME_MUST_BE_DIFFERENT: "Username must be different",
    USER_NOT_FOUND_OR_ALREADY_DELETED: "User not found or already deleted",
    USER_NOT_FOUND_OR_NOT_DELETED: "User not found or already deleted",
    USER_NOT_FOUND: "User not found",
    CANNOT_UPDATE_A_DELETED_USER: "Cannot update a deleted user",
    CANNOT_UPDATE_PASSWORD_OF_DELETED_USER:
      "Cannot update password of a deleted user",
    CANNOT_UPDATE_EMAIL_OF_DELETED_USER:
      "Cannot update email of a deleted user",
    INVALID_CURRENT_PASSWORD: "Invalid current password",
    NEW_PASSWORD_CANNOT_BE_SAME_AS_OLD_PASSWORD:
      "New password cannot be same as old password",
    EMAIL_MUST_BE_DIFFERENT_FROM_CURRENT_EMAIL:
      "Email must be different from current email",
    USER_CREATED: "User created",
    USER_FETCHED: "User fetched:",
    INVALID_USER_ID: "Invalid user id",
    USER_DELETED: "User deleted",
    USER_RESTORED: "User restored",
    USER_UPDATED: "User updated",
    YOU_CAN_ONLY_SET_YOUR_OWN_PASSWORD: "You can only set your own password",
    USER_PASSWORD_RESET_SUCCESSFUL: "User password reset successful",
    YOU_CAN_ONLY_SET_YOUR_OWN_EMAIL: "You can only set your own email",
    USER_EMAIL_UPDATED_SUCCESSFUL: "User email updated successful",
    EMAIL_VERIFICATION_SUCCESSFUL: "Email verification successful",
    YOU_CAN_ONLY_UPDATE_YOUR_OWN_PROFILE:
      "You can only update your own profile",
    CANNOT_DELETE_OTHER_USER: "Cannot delete other user",
  },
  SEVEKARI: {
    SEVEKARI_CREATED_SUCCESS: "Sevekari created successfully",
    SEVEKARI_MOBILE_ALREADY_EXISTS: "Mobile already exists",
    SEVEKARI_MISSING_TEMPLE_ID: "Missing temple id for sevekari",
    SEVEKARI_NOT_FOUND_OR_DELETED: "Sevekari not found or deleted",
    SEVEKARI_NOT_FOUND: "Sevekari not found",
    INVALID_SEVEKARI_ID: "Invalid sevekari id",
    CANNOT_UPDATE_DELETED_SEVEKARI: "Cannot update deleted sevekari",
  },
  COMMON: {
    SERVER_ERROR: "Internal server error",
    INVALID_PAGINATION_PARAMS: "Invalid pagination params",
  },
  DEV: {
    SERVER_WITHOUT_DB: "Server start without Database",
    SERVER_ON_PORT: "Server start on port",
    SERVER_START_FAIL: "Server start failed",
  },
  URL: {
    VERIFY_EMAIL: "http://localhost:4001/api/user/verify-email/",
  },
  TEMPLE: {
    TEMPLE_CREATED: "Temple created",
    TEMPLE_FETCHED: "Temple fetched",
    TEMPLE_DELETED: "Temple deleted",
    INVALID_TEMPLE_ID: "Invalid Temple id",
    TEMPLE_DOES_NOT_EXISTS_OR_ALREADY_DELETED:
      "Temple does not exist or already deleted",
    TEMPLE_DOES_NOT_EXISTS: "Temple does not exists",
    TEMPLE_ALREADY_EXISTS: "Temple already exists",
  },
  SERVER: {
    HEALTH_OK: "Server is healthy",
    HEALTH_FAILED: "Health check failed",
  },
  AUDIT: {
    AUDIT_LOG_WRITE_FAILED: "Audit log write failed",
  },
} as const;

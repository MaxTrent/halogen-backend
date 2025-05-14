
import httpStatus from "http-status";
import ApiError from "../../common/api-error";
export class UserNamespace {
  public static async getUserById(userId: string, throwError: boolean = true) {
    const user = await User.findById(userId);
    if (!user && throwError) {
      throw new ApiError(httpStatus.NOT_FOUND, "The requested user does not exist");
    }
    return user;
  }

  public static async getUserByEmail(email: string, throwError: boolean = true) {
    const user = await User.findOne({ email });
    if (!user && throwError) {
      throw new ApiError(httpStatus.NOT_FOUND, "The requested user does not exist");
    }
    return user;
  }
}

import ApiError from "../../common/api-error";
import { getNextMinute } from "../utils/time";

class OnboardingNameSpace{
    public static async initiateSignUp(signupDetails: {fullname:string, email:string}){
        try {
            const existingUser = await UserNamespace.getUserByEmail(signupDetails.email, false);
      
            if (existingUser) {
              throw new ApiError(httpStatus.BAD_REQUEST, "A user with this email address already exists");
            }
      
            const expires_on = getNextMinute(5);
      
            const otp = generateAnOtp();
      
            await SignupEmailOtp.create({
              email: signupDetails.email,
              otp,
              expires_on
            });
            await EmailService.sendSignupOtp(signupDetails.email, otp);
          } catch (error) {
            throw error;
          }
    }
}

function generateAnOtp() {
    throw new Error("Function not implemented.");
}

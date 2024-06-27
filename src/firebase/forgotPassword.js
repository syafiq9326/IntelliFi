import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';

const forgotPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    // Email sent successfully
    console.log("Password reset email sent");
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      // Handle the scenario where the user doesn't exist
      console.error("User with this email doesn't exist:", error.message);
      throw new Error("User with this email doesn't exist");
    } else {
      // Handle other errors
      console.error("Error sending password reset email:", error);
      throw error;
    }
  }
};

export { forgotPassword };
// Methods
import registerAccount from "./userControllers/registerAccount/registerAccount";
import validateAccount from "./userControllers/validateAccount/validateAccount";
import authenticate from "./userControllers/authenticate/authenticate";
import createSubAccount from "./userControllers/createSubAccount/createSubAccount";
import getAllAccountsByRestaurantId from "./userControllers/getAllAccountsByRestaurantId/getAllAccountsByRestaurantId";
import deleteSubAccount from "./userControllers/deleteSubAccount";
import getAccountInfo from "./userControllers/getAccountInfo";
import resetPassword from "./userControllers/resetPassword";
import changePassword from "./userControllers/changePassword";

const User = {
    // Account registration
    registerAccount,
    // Account Validation
    validateAccount,
    // User authentication
    authenticate,
    // Sub account creation
    createSubAccount,
    // Get all sub account by restaurant id
    getAllAccountsByRestaurantId,
    // Sub account deletion
    deleteSubAccount,
    // Consult account
    getAccountInfo,
    // Reset password
    resetPassword,
    // Change password
    changePassword,
};

export default User;

// Methods
import registerAccount from "./userControllers/registerAccount/registerAccount";
import validateAccount from "./userControllers/validateAccount/validateAccount";
import authentication from "./userControllers/authenticate";
import getAllSubAccount from "./userControllers/getAllSubAccount";
import createSubAccount from "./userControllers/createSubAccount";
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
    authentication,
    // Get all sub account
    getAllSubAccount,
    // Sub account creation
    createSubAccount,
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

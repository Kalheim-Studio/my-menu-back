// Methods
import registerAccount from "./methods/registerAccount";
import validateAccount from "./methods/validateAccount";
import authentication from "./methods/authenticate";
import getAllSubAccount from "./methods/getAllSubAccount";
import createSubAccount from "./methods/createSubAccount";
import deleteSubAccount from "./methods/deleteSubAccount";
import getAccountInfo from "./methods/getAccountInfo";
import resetPassword from "./methods/resetPassword";
import changePassword from "./methods/changePassword";

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

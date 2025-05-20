import register from "./register.js";
import confirmRegistration from "./confirmRegistration.js";
import login from "./login.js";
import requestPasswordReset from "./requestPasswordReset.js";
import resetPassword from "./resetPassword.js";
import profile from "./profile.js";
import list from "./list.js";
import update from "./update.js";
import upload from "./upload.js";
import avatar from "./avatar.js";
import deleteUser from "./deleteUser.js";
import requestAccountRecovery from "./requestRecoverAccount.js";
import recoverAccount from "./recoverAccount.js";
import banUser from "./banUser.js";
import unbanUser from "./unbanUser.js";

export const userController = { 
    register, 
    confirmRegistration,
    list, 
    login, 
    requestPasswordReset,
    resetPassword,
    profile, 
    update, 
    upload,
    avatar,
    deleteUser,
    requestAccountRecovery,
    recoverAccount,
    banUser,
    unbanUser,
};

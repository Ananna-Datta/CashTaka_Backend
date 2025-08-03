"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const env_1 = require("../config/env");
const jwt_1 = require("../utils/jwt");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../errorhelper/appError"));
const user_model_1 = require("../modulers/user/user.model");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new appError_1.default(403, "No Token Received");
        }
        const token = accessToken.startsWith("Bearer ")
            ? accessToken.slice(7)
            : accessToken;
        const verifiedToken = (0, jwt_1.verifyToken)(token, env_1.envVars.JWT_ACCESS_SECRET);
        const isUserExist = yield user_model_1.User.findOne({ email: verifiedToken.email });
        if (!isUserExist) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
        }
        if (isUserExist.role === "AGENT" && isUserExist.status === "suspended") {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Suspended agents cannot access this feature");
        }
        if (!authRoles.includes((_a = verifiedToken.role) === null || _a === void 0 ? void 0 : _a.toUpperCase())) {
            throw new appError_1.default(403, "You are not permitted to view this route!!!");
        }
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        console.log("jwt error", error);
        next(error);
    }
});
exports.checkAuth = checkAuth;

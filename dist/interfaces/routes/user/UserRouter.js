"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const ChangePasswordUseCase_1 = require("../../../application/use-cases/users/ChangePasswordUseCase");
const CreateUserUseCase_1 = require("../../../application/use-cases/users/CreateUserUseCase");
const FindUserUseCase_1 = require("../../../application/use-cases/users/FindUserUseCase");
const ListUsersUseCase_1 = require("../../../application/use-cases/users/ListUsersUseCase");
const RecoverPasswordUseCase_1 = require("../../../application/use-cases/users/RecoverPasswordUseCase");
const AuthMiddleware_1 = require("../../../infra/api/auth/AuthMiddleware");
const ChangePasswordExpress_1 = require("../../../infra/api/routes/user/ChangePasswordExpress");
const CreateUserExpress_1 = require("../../../infra/api/routes/user/CreateUserExpress");
const FindUserExpress_1 = require("../../../infra/api/routes/user/FindUserExpress");
const ListUserExpress_1 = require("../../../infra/api/routes/user/ListUserExpress");
const RecoverPasswordUserExpress_1 = require("../../../infra/api/routes/user/RecoverPasswordUserExpress");
const prisma_1 = require("../../../infra/config/prisma/prisma");
const UserRespositoryPrisma_1 = require("../../../infra/repositories/user/UserRespositoryPrisma");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authMiddleware = new AuthMiddleware_1.AuthMiddleware(process.env.SECRET_KEY || 'mysecretkeyfcbackend');
//user
const userRepository = UserRespositoryPrisma_1.UserRepositoryPrisma.create(prisma_1.prisma);
const createUserUsecase = CreateUserUseCase_1.CreateUserUseCase.create(userRepository);
const listUserUsecase = ListUsersUseCase_1.ListUserUseCase.create(userRepository);
const findUserUsecase = FindUserUseCase_1.FindUserUseCase.create(userRepository);
const recoverPasswordUsecase = RecoverPasswordUseCase_1.RecoverPasswordUseCase.create(userRepository);
const chnagePasswordUsecase = ChangePasswordUseCase_1.ChangePasswordUseCase.create(userRepository);
exports.userRoutes = [
    CreateUserExpress_1.CreateUserRoute.create(createUserUsecase),
    ListUserExpress_1.ListUserRoute.create(listUserUsecase, authMiddleware),
    FindUserExpress_1.FindUserRoute.create(findUserUsecase),
    RecoverPasswordUserExpress_1.RecoverPasswordUserRoute.create(recoverPasswordUsecase),
    ChangePasswordExpress_1.ChangePasswordUserRoute.create(chnagePasswordUsecase),
];

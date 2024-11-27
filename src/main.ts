import dotenv from "dotenv";
dotenv.config();
import { prisma } from "./config/prisma/prisma";
import { ApiExpress } from "./infra/api/express/ApiExpress";
import { UserRepositoryPrisma } from "./infra/repositories/user/UserRespositoryPrisma";
import { ListUserUseCase } from "./useCases/user/list/ListUsersUseCase";
import { CreateUserRoute } from "./infra/api/express/routes/user/CreateUserExpress";
import { ListUserRoute } from "./infra/api/express/routes/user/ListUserExpress";
import { FindUserRoute } from "./infra/api/express/routes/user/FindUserExpress";
import { CreateUserUseCase } from "./useCases/user/create/CreateUserUseCase";
import { FindUserUseCase } from "./useCases/user/find/FindUserUseCase";
import { AuthMiddleware } from "./infra/auth/AuthMiddleware";
import { LoginUserUseCase } from "./useCases/login/LoginUseCase";
import { LoginRepositoryPrisma } from "./infra/repositories/login/LoginRespositoryPrisma";
import { LoginRoute } from "./infra/api/express/routes/login/LoginExpress";
import { CreateExpenseRepositoryPrisma } from "./infra/repositories/expense/ExpenseRepositoryPrisma";
import { CreateExpenseUseCase } from "./useCases/expenses/create/CreateExpenseUseCase";
import { CreateExpenseRoute } from "./infra/api/express/routes/expenses/CreateExpenseExpress";

//auth
const authMiddleware = new AuthMiddleware(process.env.SECRET_KEY || 'mysecretkeyfcbackend');

//user
const userRepository = UserRepositoryPrisma.create(prisma);

const createUserUsecase = CreateUserUseCase.create(userRepository);
const listUserUsecase = ListUserUseCase.create(userRepository);
const findUserUsecase = FindUserUseCase.create(userRepository);

const createUserRoute = CreateUserRoute.create(createUserUsecase);
const listUserRoute = ListUserRoute.create(listUserUsecase, authMiddleware);
const findUserRoute = FindUserRoute.create(findUserUsecase);

//login
const loginRepository = LoginRepositoryPrisma.create(prisma);

const loginUsecase = LoginUserUseCase.create(loginRepository);  
    
const loginRoute = LoginRoute.create(loginUsecase);

//Expense
const CreateExpenseRepository = CreateExpenseRepositoryPrisma.build(prisma);

const CreateExpenseUsecase = CreateExpenseUseCase.create(CreateExpenseRepository);  
    
const createExpenseRoute = CreateExpenseRoute.create(CreateExpenseUsecase);

const api = ApiExpress.create([
    loginRoute,
    createUserRoute, listUserRoute, findUserRoute,
    createExpenseRoute
]);

const port = process.env.PORT || 3001;

api.start(Number(port));
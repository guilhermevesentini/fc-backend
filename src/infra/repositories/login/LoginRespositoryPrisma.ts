import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { LoginGateway } from "../../gateways/login/LoginGateway";
import { Login } from "../../../domain/entities/login/login";

export class LoginRepositoryPrisma implements LoginGateway {
  private constructor(private readonly prismaClient: PrismaClient){}

  public static create(prismaClient: PrismaClient){
    return new LoginRepositoryPrisma(prismaClient)
  }

  public async handle(login: Login): Promise<void> {
    const hashedPassword = await bcrypt.hash(login.password, 10);

    const data = {
      username: login.username,
      password: hashedPassword
    }

    await this.prismaClient.user.create({
      data
    })
  }

  public async validateUser(username: string): Promise<{ username: string, password: string, customerId: string } | undefined> {
    const userData = await this.prismaClient.user.findUnique({
      where: { username }
    });
  
    console.log('userData', userData);
    

    if (!userData) return
  
    return {
      username: userData.username,
      password: userData.password,
      customerId: userData.id
    };
  }
}
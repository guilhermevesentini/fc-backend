import { Request, Response } from "express"
import { HttpMethod, Route } from "../../../../interfaces/routes/route"
import { FindUserOutputDto } from "../../../../application/dtos/usersDto";
import { ResponseHandler } from "../../../../interfaces/controllers/ResponseHandlers";
import { FindUserUseCase } from "../../../../application/use-cases/users/FindUserUseCase";

export class FindUserRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findUserService: FindUserUseCase
  ) {}

  public static create(
    findUserService: FindUserUseCase
  ): FindUserRoute {
    return new FindUserRoute(
      "/find-user/:email",
      HttpMethod.GET,
      findUserService
    );
  }

  public getHandler() {
    return [
      async (request: Request, response: Response) => {
        try {
          const { email } = request.params;  
  
          if (!email) {
            ResponseHandler.error(response, 'Nome do usuário é obrigatório')
  
            return;
          }
  
          const output = await this.findUserService.execute({email});
  
          if (!output) {
            ResponseHandler.error(response, 'Usuário não encontrado')
  
            return;
          }
  
          const responseBody = this.present(output);
  
          ResponseHandler.success(response, responseBody)
        } catch (error) {
          console.error("Error in FindUserRoute:", error);
  
          ResponseHandler.internalError(response, error as string)
        }
      }
    ]
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
      return this.method;
  }

  private present(input: FindUserOutputDto): FindUserOutputDto {
      const response: FindUserOutputDto = {
        id: input.id,
        email: input.email,
        username: input.username,
        password: input.password
      };

      return response;
  }
}
import { PrismaClient } from "@prisma/client";
import { CategoriesGateway } from "../../gateways/categories/CategoriesGateway";
import { CategoriesDto, DeleteCategoriesInputDto, GetCategoriesInputDto, GetCategoriesOutputDto } from "../../../application/dtos/CategoriesDto";
import { ETipoCategory } from "../../../@types/enums";
import { v4 as uuidv4 } from 'uuid';

export class CategoriesRepositoryPrisma implements CategoriesGateway {

  private constructor(private readonly prismaClient: PrismaClient) { }
     
  public static build(prismaClient: PrismaClient) {
    return new CategoriesRepositoryPrisma(prismaClient)
  }

  public async create(input: CategoriesDto): Promise<void> {
    if (!input.nome || !input.tipo || !input.customerId) throw new Error("Falta dados na categoria")
    
    const categoriesModel = {
      id: uuidv4(),
      nome: input.nome,
      customerId: input.customerId,
      color: input.color
    }

    if (input.tipo == ETipoCategory.income) {
      await this.prismaClient.incomesCategories.create({
        data: categoriesModel
      })
    }

    if (input.tipo == ETipoCategory.expense) {
      await this.prismaClient.expensesCategories.create({
        data: categoriesModel
      })
    }      
  }

  public async edit(input: CategoriesDto): Promise<void> {
    const model = {
      id: input.id,
      nome: input.nome,
      customerId: input.customerId,
      color: input.color
    }

    if (input.tipo == ETipoCategory.income) {
      await this.prismaClient.incomesCategories.update({
        where: {
          customerId: model.customerId,
          id: model.id
        },
        data: {
          ...model
        }
      })
    }

    if (input.tipo == ETipoCategory.expense) {
      await this.prismaClient.expensesCategories.update({
        where: {
          customerId: model.customerId,
          id: model.id
        },
        data: {
          ...model
        }
      })
    }    
  }

  public async get(input: GetCategoriesInputDto): Promise<GetCategoriesOutputDto[]> {
    if (!input.customerId) throw new Error("Falta dados na categoria")
    
    let model: GetCategoriesOutputDto[] = []

    if (input.tipo == ETipoCategory.income) {
      const response = await this.prismaClient.incomesCategories.findMany({
        where: {
          customerId: input.customerId
        }
      })

      if (!response) throw new Error("Erro ao buscar as categorias")
      
      response.forEach((category) => {
        const data = {
          id: category.id,
          nome: category.nome,
          color: category.color,
          customerId: category.customerId
        }
        model.push(data)
      })
    }

    if (input.tipo == ETipoCategory.expense) {
      const response = await this.prismaClient.expensesCategories.findMany({
        where: {
          customerId: input.customerId
        }
      })

      if (!response) throw new Error("Erro ao buscar as categorias")
      
      response.forEach((category) => {
        const data = {
          id: category.id,
          nome: category.nome,
          color: category.color,
          customerId: category.customerId
        }
        model.push(data)
      })
    }    
    
    if (!input.tipo) {
      const responseExpenses = await this.prismaClient.expensesCategories.findMany({
        where: {
          customerId: input.customerId
        }
      })

      const responseIncomes = await this.prismaClient.incomesCategories.findMany({
        where: {
          customerId: input.customerId
        }
      })

      if (!responseExpenses && !responseIncomes) throw new Error("Erro ao buscar as categorias")
      
      responseExpenses.forEach((category) => {
        const data = {
          id: category.id,
          nome: category.nome,
          color: category.color,
          customerId: category.customerId
        }
        model.push(data)
      })

      responseIncomes.forEach((category) => {
        const data = {
          id: category.id,
          nome: category.nome,
          color: category.color,
          customerId: category.customerId
        }
        model.push(data)
      })
    } 

    return model
  }

  public async delete(input: DeleteCategoriesInputDto): Promise<void> {
    if (input.tipo == ETipoCategory.income) {
      await this.prismaClient.incomesCategories.delete({
        where: {
          id: input.id
        }
      })
    }

    if (input.tipo == ETipoCategory.expense) {
      await this.prismaClient.expensesCategories.delete({
        where: {
          id: input.id
        }
      })
    }    
  }
  
}
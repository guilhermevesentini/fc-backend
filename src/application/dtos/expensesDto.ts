
export type ExpenseDto = {
  id: string;
  nome: string;
  recorrente: string
  vencimento: Date
  customerId: string
  frequencia: string
  replicar: boolean
  meses?: ExpenseMonthDto[];
}

export type ExpenseMonthDto = {
  id: string
  mes: number
  ano: number
  valor: string
  contaId: string
  status: string
  despesaId: string
  descricao: string  
  customerId: string
  vencimento: Date;
  observacao: string
  categoria: string
}

export type ExpenseInputDto = {
  id: string;
  nome: string;
  recorrente: string
  vencimento: Date
  frequencia: string
  despesaId: string
  replicar: boolean
  contaId: string
  customerId: string
  categoria: string
  mes: number
  ano: number
  valor: string
  status: string
  descricao: string
  observacao: string
}

export type ExpenseOutputDto = ExpenseInputDto

export type CreateExpenseMonthInputDto = {
  mes: number
  ano: number
  customerId: string
}

export type GetExpenseMonthInputDto = CreateExpenseMonthInputDto;

export type GetExpenseOutputDto = ExpenseOutputDto[]

export type DeleteExpenseInputDto = {
  id: string
  customerId: string
  mes?: number
}
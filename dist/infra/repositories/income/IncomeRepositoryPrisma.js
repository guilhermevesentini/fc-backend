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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeRepositoryPrisma = void 0;
const uuid_1 = require("uuid");
class IncomeRepositoryPrisma {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    static build(prismaClient) {
        return new IncomeRepositoryPrisma(prismaClient);
    }
    create(income, monthsData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!income.customerId)
                throw new Error('Erro ao autenticar usuário');
            const incomeData = {
                id: (0, uuid_1.v4)(),
                nome: income.nome,
                recebimento: income.recebimento,
                tipoLancamento: income.tipoLancamento,
                inicio: (_a = income.range) === null || _a === void 0 ? void 0 : _a.inicio,
                fim: (_b = income.range) === null || _b === void 0 ? void 0 : _b.fim,
                replicar: income.replicar,
                customerId: income.customerId,
            };
            if (!monthsData.length)
                throw new Error('Ocorreu um problema ao criar os meses');
            if (!incomeData.id)
                throw new Error('Não é possível criar os meses por conta de identificação.');
            const months = monthsData === null || monthsData === void 0 ? void 0 : monthsData.map((m) => ({
                id: (0, uuid_1.v4)(),
                mes: m.mes,
                ano: m.ano,
                valor: parseFloat(Number(m.valor).toFixed(2)),
                contaId: m.contaId,
                status: Number(m.status),
                incomeId: incomeData.id,
                descricao: m.descricao,
                customerId: m.customerId,
                recebimento: m.recebimento,
                observacao: m.observacao,
                categoria: m.categoria
            }));
            const isInvalidMonth = months === null || months === void 0 ? void 0 : months.map((mes) => mes.mes >= 13 || mes.mes <= 0).some((item) => item == true);
            if (isInvalidMonth)
                throw new Error('Mes incorreto');
            try {
                yield this.prismaClient.incomes.create({
                    data: incomeData,
                });
                if (months) {
                    yield this.prismaClient.incomeMonths.createMany({
                        data: months,
                    });
                }
            }
            catch (err) {
                console.log('Erro ao criar receita:', err);
                throw new Error('Erro ao criar receita');
            }
            return Object.assign(Object.assign({}, incomeData), { meses: months === null || months === void 0 ? void 0 : months.map((m) => (Object.assign(Object.assign({}, m), { valor: m.valor.toString(), status: m.status.toString() }))) });
        });
    }
    get(mes, ano, customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!customerId)
                throw new Error('Erro ao autenticar usuário');
            const incomes = yield this.prismaClient.incomes.findMany({
                where: {
                    customerId,
                }
            });
            const months = yield this.prismaClient.incomeMonths.findMany({
                where: {
                    mes,
                    ano,
                    customerId,
                },
                select: {
                    id: true,
                    mes: true,
                    ano: true,
                    valor: true,
                    status: true,
                    descricao: true,
                    incomeId: true,
                    customerId: true,
                    recebimento: true,
                    observacao: true,
                    categoria: true,
                    contaId: true,
                },
            });
            const formattedIncomes = incomes.map((income) => {
                const filteredMonths = months.filter((mes) => mes.incomeId === income.id);
                const mappedMonths = filteredMonths.map((mes) => ({
                    id: mes.id,
                    mes: mes.mes,
                    incomeId: mes.incomeId,
                    ano: mes.ano,
                    contaId: mes.contaId,
                    valor: mes.valor.toString(),
                    status: mes.status.toString(),
                    descricao: mes.descricao,
                    customerId: mes.customerId,
                    recebimento: mes.recebimento,
                    observacao: mes.observacao,
                    categoria: mes.categoria,
                }));
                return Object.assign(Object.assign({}, income), { meses: mappedMonths });
            });
            return formattedIncomes;
        });
    }
    edit(income) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!income.customerId)
                throw new Error('Erro ao autenticar usuário');
            const existingIncome = yield this.prismaClient.incomes.findUnique({
                where: {
                    id: income.incomeId
                },
            });
            if (!existingIncome) {
                throw new Error(`Receita não encontrada para o mês ${income.mes} e ano ${income.ano}`);
            }
            yield this.prismaClient.incomes.update({
                where: { id: existingIncome.id },
                data: {
                    nome: income.nome,
                    recebimento: income.recebimento,
                    tipoLancamento: income.tipoLancamento,
                    inicio: (_a = income.range) === null || _a === void 0 ? void 0 : _a.inicio,
                    fim: (_b = income.range) === null || _b === void 0 ? void 0 : _b.fim,
                    replicar: income.replicar,
                },
            });
            yield this.editMonth(income);
        });
    }
    editMonth(mes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mes || mes.mes >= 13 || mes.mes <= 0)
                throw new Error('Mes incorreto');
            const existingIncomeMonth = yield this.prismaClient.incomeMonths.findUnique({
                where: {
                    id: mes.id,
                    mes: Number(mes.mes)
                },
            });
            if (!existingIncomeMonth) {
                throw new Error(`Receita não encontrada para o mês ${mes.mes} e ano ${mes.ano}`);
            }
            const valor = parseFloat(Number(mes.valor).toFixed(2));
            yield this.prismaClient.incomeMonths.update({
                where: {
                    id: existingIncomeMonth.id,
                },
                data: {
                    valor: valor,
                    descricao: mes.descricao,
                    observacao: mes.observacao,
                    recebimento: mes.recebimento,
                    status: Number(mes.status),
                    categoria: mes.categoria,
                    ano: mes.ano,
                    mes: mes.mes,
                    contaId: mes.contaId
                },
            });
        });
    }
    delete(customerId, id, mes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mes || !customerId || !id)
                throw new Error('Houve um erro ao deletar');
            if (mes == 99) {
                yield this.prismaClient.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                    yield prisma.incomeMonths.deleteMany({
                        where: {
                            customerId: customerId,
                            incomeId: id,
                        },
                    });
                    yield prisma.incomes.delete({
                        where: {
                            customerId,
                            id,
                        },
                    });
                }));
            }
            else {
                yield this.prismaClient.incomeMonths.deleteMany({
                    where: {
                        customerId: customerId,
                        incomeId: id,
                        mes: mes,
                    },
                });
                const months = yield this.prismaClient.incomeMonths.findMany({
                    where: {
                        incomeId: id,
                    },
                    select: {
                        id: true,
                        mes: true,
                        ano: true,
                        valor: true,
                        status: true,
                        descricao: true,
                        incomeId: true,
                        customerId: true,
                        recebimento: true,
                        observacao: true,
                        categoria: true,
                        contaId: true,
                    },
                });
                if (months.length == 0) {
                    yield this.prismaClient.incomes.deleteMany({
                        where: {
                            customerId,
                            id: id,
                        },
                    });
                }
            }
        });
    }
}
exports.IncomeRepositoryPrisma = IncomeRepositoryPrisma;

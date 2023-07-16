import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PrismaClient, boletos } from '@prisma/client';



interface boletoAtributos {
    nome: string
    unidade: number
    valor: number
    linha_digitavel: string,
}

interface loteprops {
    id: number;
    nome: string;
    ativo: boolean;
    criado_em: Date;
}

interface boletoQueryProps {
    nome: string,
    valor_inicial: string,
    valor_final: string,
    id_lote: string
}

@Injectable()
export class BancoService {

    constructor(private prisma: PrismaService) { }

    async addBoleto({ linha_digitavel, nome, unidade, valor }: boletoAtributos) {

        try {

            let lote = await this.consultarLotes(unidade)

            if (!lote) {
                lote = await this.addLote(unidade)
                console.log(lote)
            }

            await this.prisma.boletos.create({
                data: {
                    nome_sacado: nome,
                    valor: valor,
                    linha_digitavel: linha_digitavel,
                    ativo: true,
                    id_lote: lote.id,
                    criado_em: new Date()
                }
            })
        } catch (e) {
            throw new HttpException(`Erro: ${e.message}`, HttpStatus.BAD_REQUEST)
        }

    }

    async consultarLotes(nome: number): Promise<loteprops> {

        return await this.prisma.lotes.findFirst({
            where: {
                nome: nome.toString()
            }
        })
    }

    async addLote(nome: number): Promise<loteprops> {

        return await this.prisma.lotes.create({
            data: {
                nome: nome.toString(),
                ativo: true,
                criado_em: new Date(),
            }
        })

    }

    async getBoleto({ id_lote, nome, valor_final, valor_inicial }: boletoQueryProps) {

        const where = {}

        if (id_lote) {
            where['id_lote'] = parseInt(id_lote)
        }

        if (nome) {
            where['nome_sacado'] = {
                contains: nome
            }
        }

        if (valor_inicial) {
            if (!where['valor']) {
                where['valor'] = {}
            }

            where['valor'].lte = valor_inicial
        }

        if (valor_final) {
            if (!where['valor']) {
                where['valor'] = {}
            }

            where['valor'].lte = parseFloat(valor_final)
        }

        if (valor_inicial) {
            if (!where['valor']) {
                where['valor'] = {}
            }

            where['valor'].gt = parseFloat(valor_inicial)
        }

        const data = await this.prisma.boletos.findMany({ where: where })

        return data
    }

    async getAll(): Promise<boletos[]> {

        const data = await this.prisma.boletos.findMany()
        return data
    }

}
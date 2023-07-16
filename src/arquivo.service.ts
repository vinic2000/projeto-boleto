import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';

import { boletos } from '@prisma/client';

import { resolve } from 'path'
const fs = require('fs/promises')


const ejs = require('ejs')
var html_to_pdf = require('html-pdf-node');

interface boletoAtributos {
    nome: string
    unidade: number
    valor: number
    linha_digitavel: string
}

@Injectable()
export class ArquivoService {

    async converterCsvEmObjeto(arquivo: Buffer): Promise<boletoAtributos[]> {

        const array: [string] = await parse(arquivo, {
            columns: false
        })

        const arrayTitulos = array[0][0].split(';')

        let retorno: {}[] = []

        array.forEach((linha, index) => {

            if (index > 0) {
                const arrayAtributos = linha[0].split(';')

                let montarObjeto = {}

                arrayAtributos.forEach((atributos, index) => montarObjeto[arrayTitulos[index--]] = atributos)

                retorno.push(montarObjeto)
            }
        })

        return retorno as boletoAtributos[]
    }


    async criarPdf(boletos: boletos[]): Promise<string> {


        const path = resolve(__dirname, '..', 'src', 'arquivo.ejs');

        let options = { format: 'A4' };

        const file = {
            content: await ejs.renderFile(path, { boletos }),
            url: ""
        }

        const arquivo: Buffer = await html_to_pdf.generatePdf(file, options)


        const patchArquivo = resolve(__dirname, '..', 'src', 'pdf.pdf')
        await fs.writeFile(patchArquivo, arquivo)

        return arquivo.toString('base64')

    }

}

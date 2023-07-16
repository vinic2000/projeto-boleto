import { Body, Controller, Get, Post, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ArquivoService } from './arquivo.service';
import { BancoService } from './banco.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly arquivoService: ArquivoService,
    private readonly BancoService: BancoService
  ) { }

  @Post('importar-csv')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@UploadedFile() file: Express.Multer.File, @Res() response: Response) {

    const { buffer } = file;

    const csvObjeto = await this.arquivoService.converterCsvEmObjeto(buffer)

    csvObjeto.forEach(async csv => {
      await this.BancoService.addBoleto(csv)
    })

    return response.status(201).send({})

  }

  @Get('boletos')
  async getBoletos(@Query() query) {

    console.log(query)

    if (query.relatorio === '1') {

      const data = await this.BancoService.getBoleto(query)
      const arquivo = await this.arquivoService.criarPdf(data)

      return { base64: arquivo }
      //Necessário implementar a lógica para criar um pdf e converter em base 64

    } else {

      const data = await this.BancoService.getAll()
      return { data }

    }

  }

}

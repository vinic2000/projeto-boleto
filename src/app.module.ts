import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ArquivoService } from './arquivo.service';
import { PrismaService } from './prisma.service';
import { BancoService } from './banco.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ArquivoService, PrismaService, BancoService],
})
export class AppModule { }

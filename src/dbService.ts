import { PrismaClient } from '@prisma/client';

export default class DBService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createSecureFile(hashedPassCode: string, fileId: string) {
    return await this.prisma.securefile.create({
      data: {
        hashedPassCode,
        fileId,
      },
    });
  }

  async getSecureFile(id: string) {
    return await this.prisma.securefile.findUnique({
      where: {
        id,
      }
    })
  }

  async getAllFiles() {
    return await this.prisma.securefile.findMany();
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}

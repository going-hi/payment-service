import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/common/prisma.service';
import { FileService } from 'src/file/file.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private readonly fileService: FileService
    ){}

  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    const fileName = await this.fileService.uploadFile(file)
    const product = await this.prisma.product.create({
      data: {...createProductDto, images: fileName}
    })
    return product
  }

  async findAll(count: number, page: number) {
    const [products, totalCount] = await Promise.all([
      this.prisma.product.findMany({
        take: count,
        skip: page * count - count,
        
      }),
      this.prisma.product.count({})
    ])
    return {products, count: totalCount}
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({where: {id}})
    return product
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { InsertProductDto } from './dto/request/insert-products.dto';
import { Public } from '../auth/auth.setmetadata';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../authorization/roles.guard';
import { Roles } from '../authorization/roles.decorator';
import { Role } from '../authorization/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Products } from 'src/entities/product.entity';

@Controller('/product')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get('search')
  searchProduct(@Query('name') name: string): Promise<Products[]> {
    return this.productsService.getProductName(name);
  }

  @Public()
  @Get('/:id')
  getProduct(@Param('id', { transform: (value) => Number(value) }) id: number) {
    return this.productsService.getProduct(id);
  }

  @Public()
  @Get('')
  getProducts() {
    return this.productsService.getProducts();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  InsertProduct(
    @Body() body: InsertProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.addProduct(body, file);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put('/:id')
  @UseInterceptors(FileInterceptor('image'))
  updateProduct(
    @Param('id', { transform: (value) => Number(value) }) id: number,
    @Body() body: InsertProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.updateProduct(id, body, file);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('/:id')
  deleteProduct(
    @Param('id', { transform: (value) => Number(value) }) id: number,
  ) {
    return this.productsService.deleteProduct(id);
  }
}

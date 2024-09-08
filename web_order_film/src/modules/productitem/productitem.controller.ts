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
import { ProductItemService } from './productitem.service';
import { InsertProductItemDto } from './dto/request/insert-productitem.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../authorization/roles.guard';
import { Roles } from '../authorization/roles.decorator';
import { Role } from '../authorization/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductItem } from 'src/entities/productIteam.entity';

@Controller('/productitem')
export class ProductItemController {
  constructor(private productItemService: ProductItemService) {}

  @Roles(Role.Admin)
  @Get('search')
  searchMovie(@Query('name') name: string): Promise<ProductItem[]> {
    return this.productItemService.getProductItemName(name);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('/:id')
  getTicket(@Param('id', { transform: (value) => Number(value) }) id: number) {
    return this.productItemService.getProductItem(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('')
  getTickets() {
    return this.productItemService.getProductItems();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('')
  @UseInterceptors(FileInterceptor('imageUrl'))
  InsertTicketDto(
    @Body() body: InsertProductItemDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productItemService.addProductItem(body, file);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put('/:id')
  @UseInterceptors(FileInterceptor('imageUrl'))
  updateTicket(
    @Param('id', { transform: (value) => Number(value) }) id: number,
    @Body() body: InsertProductItemDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productItemService.updateProductItem(id, body, file);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('/:id')
  deleteTicket(
    @Param('id', { transform: (value) => Number(value) }) id: number,
  ) {
    return this.productItemService.deleteProductItem(id);
  }
}

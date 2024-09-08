import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductItem } from 'src/entities/productIteam.entity';
import { ProductItemController } from './productitem.controller';
import { ProductItemService } from './productitem.service';
import { Category } from 'src/entities/category.entity';
import { Supplier } from 'src/entities/supplier.entity';
import { Products } from 'src/entities/product.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductItem, Category, Supplier, Products]),
    MulterModule.register({
      dest: './uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [ProductItemController],
  providers: [ProductItemService],
})
export class ProductItemModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InsertProductDto } from './dto/request/insert-products.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductItem } from 'src/entities/productIteam.entity';
import { In, Like, Repository } from 'typeorm';
import { Products } from 'src/entities/product.entity';
import { InsertProductResponse } from './dto/response/insert-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductItem)
    private productItemReponsitory: Repository<ProductItem>,
    @InjectRepository(Products)
    private productsReponsitory: Repository<Products>,
  ) {}

  async getProductName(name: string): Promise<Products[]> {
    return this.productsReponsitory.find({
      where: { name: Like(`%${name}%`) },
    });
  }

  async getProduct(id: number) {
    const result = await this.productsReponsitory.findOne({
      where: { id },
      relations: ['productItems'],
    });
    return result;
  }

  async getProducts() {
    const result = await this.productsReponsitory.find({
      relations: ['productItems'],
    });
    return result;
  }

  async addProduct(
    data: InsertProductDto,
    imageFile: Express.Multer.File,
  ): Promise<InsertProductResponse> {
    const { productItemIds, ...rest } = data;
    let imageUrl: string;
    if (imageFile) {
      const fileExtension = imageFile.originalname.split('.').pop();
      imageUrl = `/uploads/${imageFile.filename}.${fileExtension}`;
    }
    const newProduct = await this.productsReponsitory.create({
      ...rest,
      image: imageUrl,
    });
    const productItems = await this.productItemReponsitory.find({
      where: { id: In(productItemIds) },
    });
    newProduct.productItems = productItems;
    const saveProduct = await this.productsReponsitory.save(newProduct);
    return saveProduct;
  }

  async updateProduct(
    id: number,
    data: InsertProductDto,
    imageFile: Express.Multer.File,
  ): Promise<string> {
    const getProduct = await this.productsReponsitory.findOne({
      where: { id },
    });
    if (!getProduct) {
      throw new NotFoundException(`Không tìm thấy Product với id ${id}`);
    }
    const { productItemIds, ...rest } = data;
    let imageUrl: string;
    if (imageFile) {
      const fileExtension = imageFile.originalname.split('.').pop();
      imageUrl = `/uploads/${imageFile.filename}.${fileExtension}`;
      rest.image = imageUrl;
    }
    const updatedProduct = this.productsReponsitory.merge(getProduct, rest);
    if (productItemIds && productItemIds.length > 0) {
      const productItems = await this.productItemReponsitory.find({
        where: { id: In(productItemIds) },
      });
      updatedProduct.productItems = productItems;
    }
    await this.productsReponsitory.save(updatedProduct);
    return 'Đã cập nhật thành công';
  }

  async deleteProduct(id: number): Promise<string> {
    await this.productsReponsitory.softRemove({ id });
    return 'đã xóa thành công';
  }
}

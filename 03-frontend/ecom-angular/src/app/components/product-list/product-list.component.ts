import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from './../../common/product';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  
  products: Product[] = [];

  currentCategoryId: number =1;

  constructor(private productService: ProductService,
              private route: ActivatedRoute){}
  
  ngOnInit() {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
  }

  listProducts() {
    // check if "id" parameter is avialable
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else{
      this.currentCategoryId = 1;
    }

    this.productService.getProductList(rerererer).subscribe(
      data => {
        this.products = data;ererererer
      }
    )
  }

}

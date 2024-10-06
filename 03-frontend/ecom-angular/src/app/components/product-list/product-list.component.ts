import { SearchComponent } from './../search/search.component';
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
  searchMode: boolean = false;

  constructor(private productService: ProductService,
              private route: ActivatedRoute){}
  
  ngOnInit() {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.hundleSearchProducts();
    }
    else{
      this.handleListProduct();
    }
    
  }
  

  handleListProduct(){
    // check if "id" parameter is avialable
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else{
      this.currentCategoryId = 1;
    }

    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  hundleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    //serach for the products using keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data=>{
        this.products = data;
      }
    )
  }

}

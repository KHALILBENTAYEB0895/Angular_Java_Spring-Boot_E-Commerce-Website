import { CartService } from './../../services/cart.service';
import { SearchComponent } from './../search/search.component';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from './../../common/product';
import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{

  products: Product[] = [];
  currentCategoryId: number =1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //properties for pagination 
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  //properties for search pagination

  previousKeyword: string="";

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService){}
  
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

    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`)


    this.productService.getProductListPaginate(this.thePageNumber-1,
                                               this.thePageSize,
                                               this.currentCategoryId).subscribe(this.processResult());
  }

  hundleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    
    //if we have a diffrent keyword than previous
    //then set thePageNumber to 1

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    //search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               theKeyword).subscribe(this.processResult())

  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult(){
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);
    
    this.cartService.addToCart(theCartItem);
  }

}

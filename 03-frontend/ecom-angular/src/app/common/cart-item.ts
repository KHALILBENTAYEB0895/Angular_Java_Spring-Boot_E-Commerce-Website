import { Product } from "./product";

export class CartItem {

    id: number;
    name: string;
    imageUrl: string;
    unitprice: number;
    quantity: number;

    constructor(product: Product){
        this.id = product.id;
        this.name = product.name;
        this.imageUrl = product.imageUrl;
        this.unitprice = product.unitPrice;
        this.quantity = 1;

    }
}

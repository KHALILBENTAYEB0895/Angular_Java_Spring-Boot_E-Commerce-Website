import { OrderItem } from './order-item';
import { Address } from './address';
import { Customer } from './customer';
import { Order } from './order';
export class Purchase {
    custormer!: Customer;
    shippingAddress!: Address;
    billingAddress!: Address;
    order!: Order;
    OrderItems!: OrderItem[];
}

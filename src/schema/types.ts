export type PlaceOrderInput = {
    customerName: string;
    restaurantId: number;
    item: string;
    quantity: number;
}

export type OrderInput = {
    id: string
}

export type Order = {
    id: string;
    customerName: string;
    restaurantId: number;
    item: string;
    quantity: number;
    status: string;
    created_at: string;
}
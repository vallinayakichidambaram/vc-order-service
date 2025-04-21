import { pool } from "../db/db";
import { PlaceOrderInput } from "./types";
import { gql } from "apollo-server";

export const typeDefs =gql `
    type Order {
    id: Int!
    customer_name: String!
    restaurant_id: Int!
    item: String!
    quantity: Int!
    status: String!
    created_at: String!
    }

     type Query {
    health: String!
  }

    type Mutation {
    placeOrder(
      customerName: String!
      restaurantId: Int!
      item: String!
      quantity: Int!
    ): Order!
  }

`;

export const resolvers = {
    Query: {
        health: () => 'Server is up! 🌈',
      },

      Mutation: {
        placeOrder: async (_: any,args: PlaceOrderInput) => {
          console.log(args)
          const { customerName, restaurantId, item, quantity } = args;
    
          const result = await pool.query(
            `INSERT INTO orders (customer_name, restaurant_id, item, quantity)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [customerName, restaurantId, item, quantity]
          );
    
          return result.rows[0];
        },
      },
}
import { Kafka } from "kafkajs";
import { pool } from "../db/db";
import { Order, OrderInput, PlaceOrderInput } from "./types";


const kafka = new Kafka({
  clientId: 'vc-order-service',
  brokers: ["localhost:9092"],
});


const sendKafkaMessage = async(order: Order) => {
  const producer = kafka.producer()
      await producer.connect()
      await producer.send({
        topic: 'orders',
        messages: [
          { value: JSON.stringify(order) },
        ],
      })
}

export const typeDefs = `#graphql
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

  type Query {
  getOrder(id: String): Order!
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
    getOrder: async (_: any, args: OrderInput) => {
      const { id } = args;
      const result = await pool.query(`
            SELECT ID,CUSTOMER_NAME,RESTAURANT_ID,ITEM,QUANTITY,STATUS,CREATED_AT FROM ORDERS WHERE ID = $1
            `, [id]);
      return result.rows[0];
    }
  },

  Mutation: {
    placeOrder: async (_: any, args: PlaceOrderInput) => {
      // console.log(args)
      const { customerName, restaurantId, item, quantity } = args;

      const result = await pool.query(
        `INSERT INTO orders (customer_name, restaurant_id, item, quantity)
             VALUES ($1, $2, $3, $4) RETURNING *`,
        [customerName, restaurantId, item, quantity]
      );
      const order = result.rows[0];
      console.log(order);
      await sendKafkaMessage(order);
      return result.rows[0];
    },
  },
}
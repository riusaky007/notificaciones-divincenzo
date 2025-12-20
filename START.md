# node version 20.18.1
# step 1
run npm install
# step 2: open a terminal an run: 
npm run nats
# step 3: open a new terminal(a second one) an run:
node index.js

# now the project is ready to listen the requirements using the url:
http://localhost:8929/api/order/place-order
# and the body
{
    "customerId": "customer-11",
    "items": [
        {
            "itemId": "item-11",
            "name": "Product 11",
            "quantity": 11,
            "price": 11
        }
    ],
    "currency": "USD"
}
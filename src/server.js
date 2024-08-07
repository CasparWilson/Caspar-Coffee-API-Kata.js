import cors from "cors";
import express from "express";
import morgan from "morgan";

const app = express();

const customers = ["Bukola", "Caspar", "Dana", "Olu", "Paul"];

app.get("/customers", function (_req, res) {
    res.json(customers);
});

//allow morgan logger to get access to each request before and after our handlers
app.use(morgan("dev"));
//auto-include CORS headers to allow consumption of our content by in-browser js loaded from elsewhere
app.use(cors());
//parse body text of requests having content-type application/json, attaching result to `req.body`
app.use(express.json());

//use the environment variable PORT, or 4000 as a fallback
const PORT = process.env.PORT ?? 4000;

const customersloyalty = [
    { name: "Bukola", customerID: 1, stamps: 2 },
    { name: "Caspar", customerID: 2, stamps: 2 },
    { name: "Dana", customerID: 3, stamps: 2 },
    { name: "Olu", customerID: 4, stamps: 2 },
    { name: "Paul", customerID: 5, stamps: 2 },
];

console.log("testing pull requests");

let nextCustomerID = 6;

app.get("/customerLoyalty", function (_req, res) {
    res.json(customersloyalty);
});

app.post("/customerLoyalty", (req, res) => {
    const newCustomer = {
        name: req.body,
        customerID: nextCustomerID,
        stamps: 0,
    };
    if (!newCustomer) {
        console.error("No new customer name received in POST/");
        res.status(400).json({
            error: "missing customer name from request body",
        });
        return;
    }
    nextCustomerID++;
    console.log({ newCustomer });
    customersloyalty.push(newCustomer);

    res.json({ outcome: "success", message: newCustomer });
});

app.listen(PORT, () => {
    console.log(
        `Your express app started listening on ${PORT}, at ${new Date()}`
    );
});

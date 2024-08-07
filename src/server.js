import cors from "cors";
import express from "express";
import morgan from "morgan";

const app = express();

//allow morgan logger to get access to each request before and after our handlers
app.use(morgan("dev"));
//auto-include CORS headers to allow consumption of our content by in-browser js loaded from elsewhere
app.use(cors());
//parse body text of requests having content-type application/json, attaching result to `req.body`
app.use(express.json());

//use the environment variable PORT, or 4000 as a fallback
const PORT = process.env.PORT ?? 4000;

const customersLoyalty = [
    { name: "Bukola", customerID: 1, stamps: 2 },
    { name: "Caspar", customerID: 2, stamps: 2 },
    { name: "Dana", customerID: 3, stamps: 2 },
    { name: "Olu", customerID: 4, stamps: 2 },
    { name: "Paul", customerID: 5, stamps: 2 },
];

let nextCustomerID = 6;

app.get("/customerLoyalty", function (_req, res) {
    res.json(customersLoyalty);
});

app.get("/customerLoyalty/:customerID", (req, res) => {
    const customerID = parseInt(req.params.customerID);
    const customerByID = customersLoyalty.find((customer) => {
        return customer.customerID === customerID;
    });
    console.log(customerByID);
    if (!customerID) {
        console.error("No customer with that ID found for /GET");
        res.status(400).json({
            error: "No customer found with that ID",
        });
        return;
    }
    res.json(customerByID);
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
    customersLoyalty.push(newCustomer);

    res.json({ outcome: "success", message: newCustomer });
});

app.patch("/customerLoyalty/:customerID/stamp", (req, res) => {
    const customerToStampID = parseInt(req.params.customerID);
    const customerToStamp = customersLoyalty.find((customer) => {
        return customer.customerID === customerToStampID;
        // console.log(customerToStamp);
    });
    if (!customerToStamp) {
        console.error("No customer with that ID found for /PATCH");
        res.status(400).json({
            error: "No customer found with that ID",
        });
        return;
    }
    console.log(customerToStamp);
    customerToStamp.stamps++;
    res.json({
        outcome: "succesfully stamped",
        message: `${customerToStamp.name} has ${customerToStamp.stamps} stamps.`,
    });
});

app.listen(PORT, () => {
    console.log(
        `Your express app started listening on ${PORT}, at ${new Date()}`
    );
});

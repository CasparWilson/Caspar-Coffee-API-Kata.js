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
    { name: "Bukola", customerID: 1, stamps: 18 },
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
    if (!customerByID) {
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
        message: `${customerToStamp.name} has ${customerToStamp.stamps} stamps. That's enough for ${Math.floor(customerToStamp.stamps / 6)} coffees!`,
    });
});

app.patch("/customerLoyalty/:customerID/freeCoffee", (req, res) => {
    const customerForFreeCoffeeID = parseInt(req.params.customerID);
    const customerForFreeCoffee = customersLoyalty.find((customer) => {
        return customer.customerID === customerForFreeCoffeeID;
    });
    if (!customerForFreeCoffee) {
        console.error("No customer with that ID found for /PATCH");
        res.status(400).json({
            error: "No customer found with that ID",
        });
        return;
    }
    if (customerForFreeCoffee.stamps < 6) {
        console.error(
            "Customer does not have enough stamps for a free coffee for /PATCH"
        );
        res.status(400).json({
            error: "That customer does not have enough stamps for a free coffee",
        });
    }
    customerForFreeCoffee.stamps -= 6;
    res.json({
        outcome: "Coffee successfully redeemed",
        message: `Enjoy your free coffee! You have ${customerForFreeCoffee.stamps} stamps.`,
    });
});

app.listen(PORT, () => {
    console.log(
        `Your express app started listening on ${PORT}, at ${new Date()}`
    );
});

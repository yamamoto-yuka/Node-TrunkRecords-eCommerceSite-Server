import express, { json } from "express";
import mysql from "mysql";
import cors from "cors";

const db = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "Truncrecords",
});

const server = express();
server.use(cors());
server.use(express.json());

db.connect(error => {
    if (error) console.log("Sorry cannot connect to db: ", error);
    else console.log("Connected to mysql db");
});

server.get("/productapi", (req, res) => {
    let allPro = "CALL `All_products`()";
    db.query(allPro, (error, data) => {
        if (error) {
            console.log(error);
        } else {
            res.json(data[0]);
            // console.log(data);
        }
    });
});

server.get("/productapi/:id", (req, res) => {
    let allPro = "CALL `All_products`()";
    let proID = req.params.id;
    db.query(allPro, (error, data) => {
        if (error) {
            console.log(error);
        } else {
            res.json(data[0].find(x => x.ProductID == proID));
        }
    });
});

// Admin
// Sign up
server.post('/signupapi', (req, res) => {
    let user_name = req.body.user_name;
    let password = req.body.password;
    let SP = " CALL `Signup`(?, ?)";
    db.query(SP, [user_name, password], (error, data, fields) => {
        if (error) {
            res.json({
                signup: false,
                message: error
            })
        } else {
            res.json({
                data: data[0],
                signup: true,
                message: "Signup Successful."
            })
        }
    })
})

// log in
server.post("/login", (req, res) => {
    let user_name = req.body.user_name;
    let password = req.body.password;
    let SP = 'CALL `Login`(?,?)';
    db.query(SP, [user_name, password], (error, data, fields) => {
        if (error) {
            res.json({ ErrorMessage: error });
        } else {
            if (data[0].length === 0) {
                res.json({
                    login: false,
                    message: "Sorry, you have provided wrong credentials"
                })
            } else {
                res.json({
                    data: data[0],
                    login: true,
                    message: "Login successful"
                })
            }
        }

    })
})

// Add new product
server.post("/addnewproduct", (req, res) => {
    let product_name = req.body.product_name;
    let product_desc = req.body.product_desc;
    let product_price = req.body.product_price;
    let product_image1 = req.body.product_image1;
    let product_image2 = req.body.product_image2;
    let product_availability = req.body.product_availability;
    let SP = 'CALL `addNewProduct`(?, ?, ?, ?, ?, ?)';
    db.query(SP, [product_name, product_desc, product_price, product_image1, product_image2, product_availability], (error, data, fields) => {
        if (error) {
            res.json({
                insert: false,
                message: error
            })
        } else {
            res.json({
                data: data[0],
                insert: true,
                message: "New product data inserted."
            })
        }
    })
})

// update
server.put('/update', (req, res) => {
    let ProductID = req.body.ProductID;
    let product_name = req.body.product_name;
    let product_desc = req.body.product_desc;
    let product_price = req.body.product_price;
    let product_image1 = req.body.product_image1;
    let product_image2 = req.body.product_image2;
    let product_availability = req.body.product_availability;
    let display = req.body.display;
    let SP = "CALL `update`(?, ?, ?, ?, ?, ?,?, ?)";
    db.query(SP, [ProductID, product_name, product_desc, product_price, product_image1, product_image2, product_availability, display], (error, data) => {
        if (error) {
            res.json({ update: false, message: error });
        } else {
            res.json({ update: true, message: "Product data successfully updated" });
        }
    })
})

server.put('/toggledisplay', (req, res) => {
    let ProductID = req.body.ProductID;
    let SP = " CALL `display_toggle`(?)";
    db.query(SP, [ProductID], (error, data) => {
        if (error) {
            res.json({ diplay: false, message: error });
        } else {
            res.json({ data: data[0], diplay: true, message: "Dispaly data updated." })
        }
    })
})

server.get('/product/:id', (req, res) => {
    let productID = req.params.id;
    let SP = "CALL `getProductID`(?)";
    db.query(SP, [productID], (error, data) => {
        if (error) {
            res.json({ productid: false, message: error })
        } else {
            if (data[0].length === 0) {
                res.json({ productid: false, message: "No product with that ID exists" })
            } else {
                res.json({ productid: true, message: "ProductID successfully", productData: data[0] })
            }
        }
    })
})

server.delete('/deleteproduct/:id', (req, res) => {
    let ProductID = req.params.id;
    let SP = "CALL `delete`(?)";
    db.query(SP, [ProductID], (error, data) => {
        if (error) {
            res.json({ delete: false, message: error });
        } else {
            res.json({ delete: true, message: "Product deleted successfully" });
        }
    })
})

server.listen(4500, function() {
    console.log("Node Express server is now running on port 4500");
});
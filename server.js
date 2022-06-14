import express, {json} from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";

// Connect to the DB
const db = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "trunkrecords",
});

db.connect(error => {
  if (error) console.log("Sorry cannot connect to db: ", error);
  else console.log("Connected to mysql db");
});

// File manipulate configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Data.now() + "-" + file.originalname);
  },
});

const fileupload = multer({storage: storage});

const server = express();
server.use(cors());
server.use(express.json());
server.use(express.static("uploads"));

// File upload
server.post("/upload", fileupload.single("image"), (req, res) => {
  res.json("Upload success");
});

// GET ALL PRODUCTS
server.get("/product", (req, res) => {
  let allPro = "CALL `getProducts`()";
  db.query(allPro, (error, products) => {
    if (error) {
      console.log(error);
    } else {
      res.json(products[0]);
    }
  });
});

// GET PRODUCT DATA BY ID
server.get("/product/:id", (req, res) => {
  let productID = req.params.id;
  let SP = "CALL `getProductByID`(?)";
  db.query(SP, [productID], (error, product) => {
    if (error) {
      res.json({productid: false, message: error});
    } else {
      if (product[0].length === 0) {
        res.json({productid: false, message: "No product with that ID exists"});
      } else {
        res.json({productid: true, message: "ProductID successfully", productData: product[0]});
      }
    }
  });
});

// POST NEW PRODUCT
server.post("/product", (req, res) => {
  let product_name = req.body.product_name;
  let product_desc = req.body.product_desc;
  let product_price = req.body.product_price;
  let product_image1 = req.body.product_image1;
  let product_image2 = req.body.product_image2;
  let product_quantity = req.body.product_quantity;
  let SP = "CALL `addProduct`(?, ?, ?, ?, ?, ?)";
  db.query(
    SP,
    [product_name, product_desc, product_price, product_image1, product_image2, product_quantity],
    (error, newProduct) => {
      if (error) {
        res.json({
          insert: false,
          message: error,
        });
      } else {
        res.json({
          newProduct: newProduct[0],
          insert: true,
          message: "New product data inserted.",
        });
      }
    }
  );
});

// PUT NEW PRODUCT
server.put("/product", (req, res) => {
  let ProductID = req.body.ProductID;
  let product_name = req.body.product_name;
  let product_desc = req.body.product_desc;
  let product_price = req.body.product_price;
  let product_image1 = req.body.product_image1;
  let product_image2 = req.body.product_image2;
  let product_quantity = req.body.product_quantity;
  let SP = "CALL `updateProduct`(?, ?, ?, ?, ?, ?, ?)";
  db.query(
    SP,
    [
      ProductID,
      product_name,
      product_desc,
      product_price,
      product_image1,
      product_image2,
      product_quantity,
    ],
    (error, updatedData) => {
      if (error) {
        res.json({update: false, message: error});
      } else {
        res.json({
          update: true,
          updatedData: updatedData[0],
          message: "Product data successfully updated",
        });
      }
    }
  );
});

// PUT NEW DISPLAY MODE
server.put("/displayupdate", (req, res) => {
  let ProductID = req.body.ProductID;
  let SP = " CALL `updateDisplay`(?)";
  db.query(SP, [ProductID], (error, displayData) => {
    if (error) {
      res.json({display: false, message: error});
    } else {
      res.json({displayData: displayData[0], display: true, message: "Display data updated."});
    }
  });
});

// DELETE PRODUCT
server.delete("/product/:id", (req, res) => {
  let ProductID = req.params.id;
  let SP = "CALL `deleteProduct`(?)";
  db.query(SP, [ProductID], (error, deleteStatus) => {
    if (error) {
      res.json({delete: false, message: error});
    } else {
      let del_success = deleteStatus[0][0].DEL_SUCCESS;
      if (del_success === 1) {
        res.json({delStatus: del_success, message: "Successfully deleted!"});
      } else {
        res.json({delStatus: del_success, message: "ID not found"});
      }
    }
  });
});

// POST (ADMIN PORTAL SIGN UP)
server.post("/signup", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let SP = " CALL `signUp`(?, ?)";
  db.query(SP, [username, password], (error, userData) => {
    if (error) {
      res.json({
        signup: false,
        message: error,
      });
    } else {
      res.json({
        userData: userData[0],
        signup: true,
        message: "Signup Successful.",
      });
    }
  });
});

// POST (ADMIN PORTAL LOG IN)
server.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let SP = "CALL `logIn`(?,?)";
  db.query(SP, [username, password], (error, data) => {
    if (error) {
      res.json({ErrorMessage: error});
    } else {
      if (data[0].length === 0) {
        res.json({
          login: false,
          message: "Sorry, you have provided wrong credentials",
        });
      } else {
        res.json({
          data: data[0],
          login: true,
          message: "Login successful",
        });
      }
    }
  });
});

server.listen(4500, function () {
  console.log("Node Express server is now running on port 4500");
});

import express from "express";
import cors from "cors";

const server = express();
server.use(cors());

let apparelData = [
  {
    id: 1,
    prd_image1: "../../assets/logo-sweat-up.png",
    prd_image2: "../../assets/logo-sweat.png",
    prd_title: "TRUNK RECORD LOGO SWEAT",
    prd_description:
      "Ships within one week.The TRUNK RECORD logo is simply printed on a gray sweatshirt. ",
    prt_price: 30.55,
    prt_availability: true,
  },
  {
    id: 2,
    prd_image1: "../../assets/logo-cap-up.png",
    prd_image2: "../../assets/logo-cap.png",
    prd_title: "TRUNK RECORD LOGO CAP",
    prd_description:
      "The colorful Trunk Records logo is printed on the cap. Take a trip with the cap!",
    prt_price: 25.55,
    prt_availability: true,
  },
  {
    id: 3,
    prd_image1: "../../assets/logo-sticker.png",
    prd_image2: "../../assets/logo-sticker-wall.png",
    prd_title: "TRUNK RECORD LOGO STICKER",
    prd_description:
      "This is the popular original logo sticker. Why not add some color to your usual items with this sticker? Please wait a little longer for resale.",
    prt_price: 8.55,
    prt_availability: false,
  },
];

server.get("/apparel", (req, res) => {
  res.json(apparelData);
});

server.get("/apparel/:id", (req, res) => {
  res.json(apparelData.find(x => x.id == req.params.id));
});

server.listen(4500, function () {
  console.log("Node Express server is now running on port 4500");
});

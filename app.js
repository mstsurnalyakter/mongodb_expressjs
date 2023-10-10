const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/penDB");
    console.log(`connected`);
  } catch (error) {
    console.log(error);
    console.log(`not connected`);
    process.exit(1);
  }
};

const pehSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

const Pen = mongoose.model("pens", pehSchema);

app.get("/", (req, res) => {
  res.send(`<h1>Home page</h1>`);
});

app.post("/pen", async (req, res) => {
  try {
    const { color, price, rating } = req.body;
    const createPen = new Pen({
      color,
      price,
      rating,
    });
    const savePen = await createPen.save();
    if (savePen) {
      res.status(201).send({
        success: true,
        message: `create pen`,
        data: savePen,
      });
    } else {
      res.status(404).send({
        success: false,
        message: `404 Not create pen`,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});
app.get("/pen", async (req, res) => {
  try {
    const pens = await Pen.find();
    if (pens) {
      res.status(200).send({
        success: true,
        message: `create pen`,
        data: pens,
      });
    } else {
      res.status(404).send({
        success: false,
        message: `404 Not create pen`,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});
app.put("/pen/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { color, price, rating } = req.body;
    const updatePen = await Pen.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          color,
          price,
          rating,
        },
      },
      {
        new: true,
      }
    );
    if (updatePen) {
      res.status(200).send({
        success: true,
        message: `create pen`,
        data: updatePen,
      });
    } else {
      res.status(404).send({
        success: false,
        message: `404 Not create pen`,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = {
  app,
  connectDB,
};

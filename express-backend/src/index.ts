import express, { Request, Response, RequestHandler } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import fs from "fs";

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  status: "active" | "archived";
}

const products: Product[] = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.get("/products", (req: Request, res: Response) => {
  res.json(products);
});

app.post("/products", (req: Request, res: Response) => {
  const product: Product = { ...req.body, id: new Date().toISOString() };
  products.push(product);
  res.status(201).json(product);
});

app.put("/products/:id", (req: Request, res: Response) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index !== -1) {
    products[index] = { ...req.body, id: req.params.id };
    res.json(products[index]);
  } else {
    res.status(404).send("Product not found");
  }
});

app.delete("/products/:id", (req: Request, res: Response) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index !== -1) {
    products.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send("Product not found");
  }
});

const uploadHandler: RequestHandler = (req, res) => {
  const multerReq = req as MulterRequest;
  if (!multerReq.file) {
    return res.status(400).send("No file uploaded");
  }
  const fileUrl = `/uploads/${multerReq.file.filename}`;
  res.json({ url: fileUrl });
};

app.post("/upload", upload.single("image"), uploadHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IProduct } from "../types/IProduct";
import { useAppDispatch } from "../store/hooks/hook";
import { addProduct, updateProduct } from "../store/productsSlice";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

type InitialProductState = Omit<IProduct, "id"> & { id?: string };

interface ProductFormProps {
  initialProduct?: InitialProductState;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialProduct }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState<InitialProductState>(
    initialProduct || {
      name: "",
      description: "",
      image: "",
      price: 0,
      status: "active",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: "active" | "archived") => {
    setProduct((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = async () => {
    if (product.id) {
      await dispatch(updateProduct(product as IProduct));
    } else {
      await dispatch(
        addProduct({ ...product, id: new Date().toISOString() } as IProduct)
      );
    }
    navigate("/products");
  };

  const handleImageUpload = ({ file }: any) => {
    if (file.status === "done") {
      const url = file.response.url;
      setProduct((prev) => ({ ...prev, image: url }));
      message.success(`${file.name} file uploaded successfully`);
    } else if (file.status === "error") {
      message.error(`${file.name} file upload failed.`);
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit} initialValues={product}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input the product name!" }]}
      >
        <Input name="name" onChange={handleChange} value={product.name} />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[
          { required: true, message: "Please input the product description!" },
        ]}
      >
        <Input.TextArea
          name="description"
          onChange={handleChange}
          value={product.description}
        />
      </Form.Item>
      <Form.Item label="Upload Image" name="upload">
        <Upload
          name="image"
          action={`${process.env.REACT_APP_API_BASE_URL}/upload`}
          onChange={handleImageUpload}
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
      {product.image && (
        <Form.Item label="Uploaded Image">
          <img
            src={product.image}
            alt="Uploaded"
            style={{ maxWidth: "100%", maxHeight: "200px" }}
          />
        </Form.Item>
      )}
      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: true, message: "Please input the product price!" }]}
      >
        <InputNumber
          name="price"
          onChange={(value) =>
            setProduct((prev) => ({ ...prev, price: value as number }))
          }
          value={product.price}
          min={0}
        />
      </Form.Item>
      <Form.Item label="Status" name="status">
        <Select value={product.status} onChange={handleStatusChange}>
          <Option value="active">Active</Option>
          <Option value="archived">Archived</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
        <Button
          type="default"
          onClick={() => navigate("/products")}
          style={{ marginLeft: "8px" }}
        >
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;

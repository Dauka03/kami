import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchProducts, deleteProduct } from "../store/productsSlice";
import { Link } from "react-router-dom";
import { IProduct } from "../types/IProduct";
import { Table, Button, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const ProductsList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteProduct(id));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img
          src={`${process.env.REACT_APP_API_BASE_URL}${image}`}
          alt="product"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: IProduct) => (
        <Space size="middle">
          <Link to={`/products/edit/${record.id}`}>Edit</Link>
          <Button type="link" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Products</h1>
      <Link to="/products/create">Add Product</Link>
      <Input
        placeholder="Search by name"
        value={searchText}
        onChange={handleSearch}
        prefix={<SearchOutlined />}
        style={{ margin: "20px 0" }}
      />
      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ProductsList;

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import ProductForm from '../components/ProductForm';
import { useParams } from 'react-router-dom';
import { IProduct } from '../types/IProduct';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = useSelector((state: RootState) => 
    state.products.products.find((p: IProduct) => p.id === id)
  );

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1>Edit Product</h1>
      <ProductForm initialProduct={product} />
    </div>
  );
};

export default EditProduct;

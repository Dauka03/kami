export interface IProduct {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    status: 'active' | 'archived';
  }
  
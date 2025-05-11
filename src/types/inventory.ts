export interface InventoryGroup {
  category: string;
  _sum: {
    stockQuantity: number;
  };
  _min: {
    reorderPoint: number;
  };
}

export interface FormattedInventory {
  category: string;
  stock: number;
  reorderPoint: number;
}
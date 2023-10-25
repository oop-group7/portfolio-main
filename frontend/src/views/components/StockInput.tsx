import React from 'react';

interface StockInputProps {
  index: number;
  stock: string;
  price: string;
  quantity: string;
  onChangeStock: (value: string) => void;
  onChangePrice: (value: string) => void;
  onChangeQuantity: (value: string) => void;
}

const StockInput: React.FC<StockInputProps> = ({
  index,
  stock,
  price,
  quantity,
  onChangeStock,
  onChangePrice,
  onChangeQuantity,
}) => {
  return (
    <>
      <tr>
        <td>
          <h5 className="text-left d-flex align-items-center">Stock {index + 1}:</h5>
        </td>
        <td>
          <input
            type="text"
            className="form-control"
            placeholder="Stock Name"
            value={stock}
            onChange={(e) => onChangeStock(e.target.value)}
          />
        </td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td>
          <input
            type="number"
            className="form-control"
            placeholder="Price"
            value={price}
            onChange={(e) => onChangePrice(e.target.value)}
          />
        </td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td>
          <input
            type="number"
            className="form-control"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => onChangeQuantity(e.target.value)}
          />
        </td>
        <td></td>
      </tr>
    </>
  );
};

export default StockInput;
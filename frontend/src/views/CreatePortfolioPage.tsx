import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'react-bootstrap-icons'
import { POST } from "../utils/apihelper";
import StockInput from './components/StockInput';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "./css/CreatePortfolioPage.css";


function CreatePortfolioPage() {

  const navigate = useNavigate();

  const [portfolioName, setPortfolioName] = useState("");
  const [strategy, setStrategy] = useState("");
  const [capital, setCapital] = useState(0);
  const [desiredStock, setDesiredStock] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [desiredStocks, setDesiredStocks] = useState<{ stockName: string; price: number; quantity: number }[]>([]);

  const [setPortfolioNameError, portfolioNameError] = useState("");

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   // Frontend input validation, for generic UX purposes, not for security purposes
  //   if (portfolioName.trim() === "") {
  //     alert("Portfolio name cannot be empty or consist only of whitespaces");
  //     return;
  //   }
  //   // check if any of the fields of the stocks are empty or consist only of whitespaces
  //   for (let i = 0; i < desiredStocks.length; i++) {
  //     if (desiredStocks[i]?.stock?.trim() === "" || desiredStocks[i]?.price?.trim() === "" || desiredStocks[i]?.quantity?.trim() === "") {
  //       alert("Stock name, price, and quantity cannot be empty or consist only of whitespaces");
  //       return;
  //     }
  //   }
  //   // const formattedStocks = desiredStocks.map((stock) => ({
  //   //   Stock: stock.stock,
  //   //   Price: stock.price,
  //   //   Quantity: stock.quantity
  //   // }));

  // }
  async function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(portfolioName, strategy, capital,desiredStocks)
    console.log(typeof capital)
    const res = await POST("/api/portfolio/create", {
      body: {
        "name": portfolioName,
        strategy,
        "capitalAmount": capital,
        desiredStocks: desiredStocks,
      },
    });
    if (!res.response.ok) {
      console.log(res.response)
      //setError("Invalid Input");
    } else{
      // console.log('in')
      navigate("/homepage");
    }
  }

  const handleAddStock = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    let stockAlreadyExists = false;

    desiredStocks.forEach((stock, index) => {
      if (stock.stockName === desiredStock) {
        // Stock name already exists, update the quantity
        stockAlreadyExists = true;
        desiredStocks[index].quantity += parseInt(quantity);
      }
    });
    
    if (! stockAlreadyExists){
      const newStock = {
        stockSymbol: "trial",
        stockName: desiredStock,
        price: parseFloat(price),
        quantity: parseInt(quantity),
      };
      desiredStocks.push(newStock);
    }
   
    setDesiredStock("");
    setPrice("");
    setQuantity("");

  };

  const handleRemoveStock = (indexToRemove: number) => {
    const updatedStocks = desiredStocks.filter((stock, index) => index !== indexToRemove);
    setDesiredStocks(updatedStocks);
  };

  return (
    <>
    <div className="container position-relative">
      <form onSubmit={handleSubmit}>
        <div className="portfolio shadow-lg p-3 bg-body rounded">
          <div className="mt-2 d-flex align-items-center">
              <ArrowLeft onClick={() => history.back()} className="me-2 fs-3" />
              <h1 className="heading mx-auto"> Portfolio</h1>
          </div>


          <div className="m-3">
            <div className="mb-2">
              Portfolio Name
              <input
                type="text"
                className="form-control"
                id="portfolioName"
                placeholder="Portfolio Name"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                />
              {/* <p className="error">{portfolioNameError}</p> */}
            </div>

            <div className="mb-2">
              Strategy
              <input
                type="text"
                className="form-control"
                id="strategy"
                placeholder="Brief Description"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
              />
              {/* <p className="error">{userNameError}</p> */}
            </div>

            <div className="mb-2">
              Capital
              <input
                type="number"
                step="any"
                className="form-control"
                id="capital"
                placeholder="Amount of Capital"
                value={capital}
                onChange={(e) => setCapital(parseInt(e.target.value))}
              />
              {/* <p className="error">{userNameError}</p> */}
            </div>

            <hr></hr>

            <div className="mb-2">
              Desired Stock:
              <select
                className="form-select"
                id="desiredStock"
                value={desiredStock}
                onChange={(e) => setDesiredStock(e.target.value)}
              >
                <option value="">Select a Stock</option>
                <option value="Stock1">Stock 1</option>
                <option value="Stock2">Stock 2</option>
                <option value="Stock3">Stock 3</option>
                {/* Add more options as needed */}
              </select>
            </div>

            <div className="mb-2">
              Price
              <input
                type="number"
                step="any"
                className="form-control"
                id="price"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {/* <p className="error">{userNameError}</p> */}
            </div>

            <div className="mb-2">
            Quantity
              <input
                type="number"
                className="form-control"
                id="quantity"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              {/* <p className="error">{userNameError}</p> */}
            </div>


            <div className="d-grid gap-2 mb-3">
              <button
                className="btn btn-secondary"
                onClick={handleAddStock}
              >
                Add
              </button>

              <div className="mb-2">
                Added Stocks:
                <div className="scrollable-list">
                  <ul>
                    {desiredStocks.map((stock, index) => (
                      <li key={index}>
                        Stock: {stock.stockName}, 
                        Price: {stock.price}, 
                        Quantity: {stock.quantity}
                        <FontAwesomeIcon className="mx-2" icon={faTrash} 
                        onClick={() => handleRemoveStock(index)}
                        style={{ cursor: "pointer" }}/>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <hr></hr>

              <div className="d-grid gap-2 mb-3">
                <button
                  type = "submit"
                  className="btn btn-primary"
                >
                  Create Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </>
  );

  }
  
  export default CreatePortfolioPage;
  

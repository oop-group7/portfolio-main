import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'react-bootstrap-icons'
import { POST } from "../utils/apihelper";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "./css/CreatePortfolioPage.css";
import {components} from "../utils/api";
import {PORTFOLIO_LIST, fetchPortfolioInformation} from "../utils/ticker"

type desiredStocks = components["schemas"]["DesiredStock"]
function CreatePortfolioPage() {

  const navigate = useNavigate();

  const [portfolioName, setPortfolioName] = useState("");
  const [strategy, setStrategy] = useState("");
  const [capital, setCapital] = useState(0);
  const [desiredStock, setDesiredStock] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [desiredStocks, setDesiredStocks] = useState<desiredStocks[]>([]);
  const [stockInfo, setStockInfo] = useState<Awaited<ReturnType<typeof fetchPortfolioInformation>>>();

  const[capitalAmountError, setCapitalAmountError] = useState("");

  useEffect(() => {
    fetchPortfolioInformation(PORTFOLIO_LIST).then((res) => {
      setStockInfo(res)
    })
  }, [])

  useEffect(() => {
    if (desiredStock !== "") {
      const selectedTicker = desiredStock.split(":")[0]!.trim();
      if (stockInfo) {
        const info = stockInfo.find((stock) => stock.metadata?.symbol === selectedTicker)
        if (info?.timeSeries) {
          const data = Object.values(info.timeSeries)[0];
          if (data) {
            setPrice(data.open)
          }
        }
      }
    }
  }, [desiredStock])
  

  async function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log(portfolioName, strategy, capital,desiredStocks)

    const res = await POST("/api/portfolio/create", {
      body: {
        "name": portfolioName,
        strategy,
        "capitalAmount": capital,
        desiredStocks: desiredStocks,
      },
    });
    if (!res.response.ok && res.error) {
        setCapitalAmountError(res.error?.error);
      
    } else {
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
        desiredStocks[index]!.quantity += parseInt(quantity);
      }
    });
    
    if (! stockAlreadyExists){
      const stock = desiredStock;
      
      const parts = stock.split(":");
      const symbol = parts[0]!.trim(); // Trim and get the first part
      const name = parts[1]!.trim(); // Trim and get the second part
      const newStock = {
        stockSymbol: symbol,
        stockName: name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
      };
      if (newStock.quantity > 0) {
        desiredStocks.push(newStock);
      }
    }
   
    setDesiredStock("");
    setPrice("");
    setQuantity("");

  };

  const handleRemoveStock = (indexToRemove: number) => {
    const updatedStocks = desiredStocks.filter((_, index) => index !== indexToRemove);
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
                required
                onChange={(e) => setPortfolioName(e.target.value)}
                />
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
                min={1}
                required
                onChange={(e) => setCapital(parseInt(e.target.value))}
              />
              <p className="error">{capitalAmountError}</p>
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
                <option value="" disabled selected>Select a Stock</option>
                {PORTFOLIO_LIST.map((portfolioInfo) => (
                  <option value={`${portfolioInfo.symbol} : ${portfolioInfo.name}`}>{`${portfolioInfo.symbol} : ${portfolioInfo.name}`}</option>
                ))}
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
                disabled
              />
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
                        Symbol: {stock.stockSymbol},
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
  

import React, { useState } from 'react';
import { ArrowLeft } from 'react-bootstrap-icons'
import StockInput from './components/StockInput';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";

function CreatePortfolioPage() {

  const [portfolioName, setPortfolioName] = useState("");
  const [strategy, setStrategy] = useState("");
  const [capital, setCapital] = useState("");
//   const [desiredStock, setDesiredStock] = useState("");
//   const [price, setPrice] = useState("");
//   const [quantity, setQuantity] = useState("");
  const [desiredStocks, setDesiredStocks] = useState<{ stock: string; price: string; quantity: string }[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Frontend input validation, for generic UX purposes, not for security purposes

    if (portfolioName.trim() === "") {
      alert("Portfolio name cannot be empty or consist only of whitespaces");
      return;
    }

    // strategy is optional

    // capital is already required, so no need to check?

    // desiredStock can be empty? If that is the case then we need to allow the user the ability to add more stocks later on

    // check if any of the fields of the stocks are empty or consist only of whitespaces
    for (let i = 0; i < desiredStocks.length; i++) {
      if (desiredStocks[i]?.stock?.trim() === "" || desiredStocks[i]?.price?.trim() === "" || desiredStocks[i]?.quantity?.trim() === "") {
        alert("Stock name, price, and quantity cannot be empty or consist only of whitespaces");
        return;
      }
    }

    const formattedStocks = desiredStocks.map((stock) => ({
      Stock: stock.stock,
      Price: stock.price,
      Quantity: stock.quantity
    }));

    console.table({
      portfolioName,
      strategy,
      capital,
      // desiredStock,
      // price,
      // quantity
      desiredStocks: formattedStocks
    });

    // api call to backend in json format using axios

    // axios.post('http://localhost:5000/createPortfolio', {
    //   portfolioName,
    //   strategy,
    //   capital,
    //   desiredStocks: formattedStocks
    // })
    // .then(function (response) {
    //   console.log(response); // better way than console.log is to show a popup saying portfolio created successfully and then redirect to portfolio page?
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });

  }

  return (
    <>
    <div className="container position-relative">
        <div className="shadow-lg p-3 bg-body rounded text-center" style={{overflowX: "auto"}}>
            <div className="d-flex align-items-center">
                <ArrowLeft onClick={() => history.back()} className="me-2 fs-3" />
                <h1 className="heading mx-auto">New Portfolio</h1>
            </div>

            <div className="m-3">
                <form onSubmit={handleSubmit}>
                <table style={{ borderCollapse: "separate", borderSpacing: "3px" }} className="table table-borderless">
                  <tbody>
                    <tr>
                      <td>
                        <h5 className="text-left d-flex align-items-center">Portfolio Name:</h5>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          id="portfolioName"
                          placeholder={portfolioName}
                          value={portfolioName}
                          onChange={(e) => setPortfolioName(e.target.value)}
                          required
                        />
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <h5 className="text-left d-flex align-items-center">Strategy:</h5>
                      </td>
                      <td>
                        <textarea
                          className="form-control"
                          id="strategy"
                          placeholder={strategy}
                          value={strategy}
                          onChange={(e) => setStrategy(e.target.value)}
                        />
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <h5 className="text-left d-flex align-items-center">Capital:</h5>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          id="capital"
                          placeholder={capital}
                          value={capital}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value) && value > 0) {
                              setCapital(value.toString());
                            }
                          }}
                          required
                        />
                      </td>
                      <td></td>
                    </tr>
                    {desiredStocks.map((stock, index) => (
                      <StockInput
                        stock={stock.stock}
                        price={stock.price}
                        quantity={stock.quantity}
                        onChangeStock={(value) => {
                          const updatedStocks = [...desiredStocks];
                          updatedStocks[index].stock = value;
                          setDesiredStocks(updatedStocks);
                        }}
                        onChangePrice={(value) => {
                          const updatedStocks = [...desiredStocks];
                          if (!isNaN(parseFloat(value)) && parseFloat(value) > 0) {
                            updatedStocks[index].price = value;
                            setDesiredStocks(updatedStocks);
                          }
                        }}
                        onChangeQuantity={(value) => {
                          const updatedStocks = [...desiredStocks];
                          if (!isNaN(parseFloat(value)) && parseFloat(value) > 0) {
                            updatedStocks[index].quantity = value;
                            setDesiredStocks(updatedStocks);
                          }
                        }}
                        index={index}
                      />
                    ))}
                    <tr>
                      <td colSpan="3">
                        <div className="d-grid gap-2 mb-3">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                              const updatedStocks = [...desiredStocks, { stock: "", price: "", quantity: "" }];
                              setDesiredStocks(updatedStocks);
                            }}
                          >
                            Add Stock
                          </button>
                        </div>
                        <div className="d-grid gap-2 mb-3">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                              if (desiredStocks.length > 0) {
                                const updatedStocks = [...desiredStocks];
                                updatedStocks.pop();
                                setDesiredStocks(updatedStocks);
                              }
                            }}
                          >
                            Remove Stock
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                    <div className="d-grid gap-2 mb-3">
                        <button type="submit" className="btn btn-primary">
                          Buy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </>
  );

  }
  
  export default CreatePortfolioPage;
  

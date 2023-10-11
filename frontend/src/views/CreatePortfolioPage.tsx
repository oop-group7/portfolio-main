import React, { useState } from 'react';
import {ArrowLeft} from 'react-bootstrap-icons'
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";

function CreatePortfolioPage() {

  const [portfolioName, setPortfolioName] = useState("");
  const [strategy, setStrategy] = useState("");
  const [capital, setCapital] = useState("");
  const [desiredStock, setDesiredStock] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.table({
      portfolioName,
      strategy,
      capital,
      desiredStock,
      price,
      quantity
    });
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
                    <table style={{borderCollapse: "separate", borderSpacing: "3px"}} className="table table-borderless">
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
                                        placeholder= { portfolioName }
                                        value={portfolioName}
                                        onChange={(e) => setPortfolioName(e.target.value)}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h5 className="text-left d-flex align-items-center">Strategy:</h5>
                                </td>
                                <td>
                                    <textarea
                                        className="form-control"
                                        id="strategy"
                                        placeholder= { strategy }
                                        value={strategy}
                                        onChange={(e) => setStrategy(e.target.value)}
                                    />
                                </td>
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
                                        placeholder= { capital }
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
                            </tr>
                            <tr>
                                <td>
                                    <h5 className="text-left d-flex align-items-center">Desired Stock:</h5>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="desiredStock"
                                        placeholder= { desiredStock }
                                        value={desiredStock}
                                        onChange={(e) => setDesiredStock(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h5 className="text-left d-flex align-items-center">Price:</h5>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="price"
                                        placeholder= { price }
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h5 className="text-left d-flex align-items-center">Quantity:</h5>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="quantity"
                                        placeholder= { quantity }
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
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
  

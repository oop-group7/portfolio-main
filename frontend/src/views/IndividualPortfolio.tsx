import { Button, Grid, IconButton, InputBase, Link, Paper, Table, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Stocks from "./components/PortfolioGrid";
import { useLocation } from 'react-router-dom';
import StockInput from "./components/StockInput";
import EditIcon from '@mui/icons-material/Edit';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import { useEffect, useState } from 'react';
import { DELETE, GET, PUT } from "../utils/apihelper";
import { PORTFOLIO_LIST, fetchPortfolioInformation } from "../utils/ticker";
import { components } from "../utils/api";

function IndividualPortfolio() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const portfolioId = searchParams.get("portfolioId");
  const [nameEditing, setNameEditing] = useState(false);
  const [name, setName] = useState<string>()
  const [stratEditing, setStratEditing] = useState<boolean>(false)
  const [strategy, setStrategy] = useState<string>()
  const [refetch, setRefetch] = useState(false)
  const [GL, setGL] = useState(0)

  const [portfolioDetails, setPortfolioDetails] = useState<components["schemas"]["PortfolioResponse"]>()
  const [displayStocks, setDisplayStocks] = useState<any>([]);
  const [stockInfo, setStockInfo] = useState<Awaited<ReturnType<typeof fetchPortfolioInformation>>>()

  useEffect(() => {
    fetchPortfolioInformation(PORTFOLIO_LIST).then((res) => {
      setStockInfo(res)
    })
  }, [])

  useEffect(() => {
    if (stockInfo) {
      const resultAppend = displayStocks
      let totalGL = 0
      resultAppend.forEach((Stock) => {
        const info = stockInfo.find((stock) => stock.metadata?.symbol === Stock.stockSymbol)
        if (info?.timeSeries) {
          const data = Object.values(info.timeSeries)[0];
          if (data) {
            console.log(data.open)
            console.log((Stock.totalPrice / Stock.quantity))
            const profitGL = Number(data.open) - (Stock.totalprice / Stock.quantity)
            console.log(profitGL)
            Stock.profitLoss = profitGL
            totalGL = totalGL + profitGL
          }
        }
      })
      setGL(totalGL)
      setDisplayStocks(resultAppend)
      console.log(resultAppend)
    }
  }, [stockInfo, displayStocks])

  useEffect(() => {
    if (portfolioDetails?.desiredStocks) {
      let resultDisplay: any = {}
      const resultAppend: any = []
      portfolioDetails.desiredStocks.forEach((item) => {
        console.log(item.stockSymbol)
        if (item.stockName in resultDisplay) {
          resultDisplay = {
            ...resultDisplay, [item.stockName]: {
              ...resultDisplay[item.stockName],
              quantity: resultDisplay[item.stockName].quantity + item.quantity,
              totalPrice: resultDisplay[item.stockName].totalPrice + (item.price * item.quantity)
            }
          }
        }
        else {
          resultDisplay = {
            ...resultDisplay, [item.stockName]: {
              symbol: item.stockSymbol,
              quantity: item.quantity,
              totalPrice: (item.price * item.quantity)
            }
          }
        }
      });
      console.log(resultDisplay)
      Object.keys(resultDisplay).forEach((key, i) => {
        resultAppend.push({
          id: i,
          stockSymbol: resultDisplay[key].symbol,
          stockName: key,
          quantity: resultDisplay[key].quantity,
          totalPrice: resultDisplay[key].totalPrice
        })
      })
      resultAppend.forEach((Stock: any) => {
        if (stockInfo) {
          const info = stockInfo.find((stock) => stock.metadata?.symbol === Stock.stockSymbol)
          if (info?.timeSeries) {
            const data = Object.values(info.timeSeries)[0];
            if (data) {
              const profitGL = Number(data.open) - (Stock.totalprice / Stock.quantity)
              Stock.profitLoss = profitGL
              totalGL = totalGL + profitGL
            }
          }
        }})
      setGL(totalGL)
      setDisplayStocks(resultAppend)
    }
  }, [portfolioDetails])

  useEffect(() => {
    if (portfolioId != null) {
      GET("/api/portfolio/get/{id}", {
        params: {
          path: {
            id: portfolioId as string
          }
        }
      })
        .then((response) => {
          setPortfolioDetails(response?.data)
          console.log("API Response:", response.data);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    }
  }, [refetch])


  function handleEnter(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, type: string) {
    if (e.key === 'Enter') {
      e.preventDefault()
      setName(e.currentTarget.value)
      if (portfolioDetails) {
        setPortfolioDetails({ ...portfolioDetails, name: e.currentTarget.value })
      }
      handleInputUpdate({ ...portfolioDetails, name: e.currentTarget.value })
      setNameEditing(false)
    }
  }

  function handleInputUpdate(data: components["schemas"]["PortfolioUpdateRequest"]) {
    PUT("/api/portfolio/updateportfolio/{id}", {
      params: {
        path: {
          id: portfolioId as string
        }
      },
      body: data
    }).then(() => {
      setRefetch(!refetch)
    })
  }

  return (

    <Grid container px={5} flexDirection={"column"}>
      <Grid item container mb={2} justifyContent={"space-between"} alignItems={"baseline"}>
        <Grid item container xs alignItems={"baseline"}>
          <Typography variant="h5">Portfolio Overview:</Typography>
          {!nameEditing ? (
            <>
              <Typography variant="h5" ml={1}>{portfolioDetails?.name}</Typography>
              <IconButton
                size="small"
                onClick={() => setNameEditing(true)}
                sx={{
                  color: "black", boxShadow: 1, backgroundColor: "white", ml: 1, ":hover": { backgroundColor: "whitesmoke" }
                }}>
                <EditIcon />
              </IconButton>
            </>
          ) : (
            <Paper
              component="form"
              sx={{ ml: 1, p: '2px 4px', alignItems: 'center', border: "solid 1px lightgray", boxShadow: "0" }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                value={name ? name : portfolioDetails?.name}
                onKeyDown={(e) => { handleEnter(e, "name") }}
                onChange={(e) => {
                  if (e.currentTarget.value.length > 0) {
                    setName(e.currentTarget.value)
                  }
                }}
              />
              <IconButton type="button" onClick={() => {
                if (portfolioDetails && name) {
                  setPortfolioDetails({ ...portfolioDetails, name })
                }
                handleInputUpdate({ ...portfolioDetails, name: name })
                setNameEditing(false)
              }} sx={{ p: '10px' }}>
                <SaveAltOutlinedIcon />
              </IconButton>
            </Paper>
          )}
          {!stratEditing ? (
            <>
              <Typography sx={{ fontSize: "16px" }} ml={1}>{portfolioDetails?.strategy}</Typography>
              <IconButton
                size="small"
                onClick={() => setStratEditing(true)}
                sx={{
                  color: "black", boxShadow: 1, backgroundColor: "white", ml: 1, ":hover": { backgroundColor: "whitesmoke" }
                }}>
                <EditIcon />
              </IconButton>
            </>
          ) : (
            <Paper
              component="form"
              sx={{ ml: 1, p: '2px 4px', alignItems: 'center', border: "solid 1px lightgray", boxShadow: "0" }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                value={strategy ? strategy : portfolioDetails?.strategy}
                onKeyDown={(e) => { handleEnter(e, "strat") }}
                onChange={(e) => {
                  if (e.currentTarget.value.length > 0) {
                    setStrategy(e.currentTarget.value)
                  }
                }}
              />
              <IconButton type="button" onClick={() => {
                if (portfolioDetails && strategy) {
                  setPortfolioDetails({ ...portfolioDetails, strategy })
                }
                handleInputUpdate({ ...portfolioDetails, strategy: strategy })
                setStratEditing(false)
              }} sx={{ p: '10px' }}>
                <SaveAltOutlinedIcon />
              </IconButton>
            </Paper>
          )}
        </Grid>
        <Button variant={"contained"} sx={{ marginRight: 2 }} endIcon={<DeleteIcon />} onClick={() => {
          DELETE("/api/portfolio/deleteportfolio/{id}", {
            params: {
              path: {
                id: portfolioId as string
              }
            }
            });
        }}>Delete Portfolio</Button>
        <Link href={"/homepage"}>Back to Dashboard</Link>
      </Grid>
      <Grid item sx={{ borderRadius: "5px", backgroundColor: "white", marginBottom: "1rem" }} >
        <TableContainer sx={{ boxShadow: 1 }}>
          <Table sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: "none",
              textAlign: "center"
            }
          }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ borderRight: "solid 1px lightgray" }}>
                  <Typography variant="h6" fontWeight={"bold"}>Total</Typography>
                </TableCell>
                <TableCell sx={{ borderRight: "solid 1px lightgray" }}>
                  <Typography fontWeight={"bold"}>Costs</Typography>
                  <Typography variant="h6" fontWeight={"bold"}>$100,000,000</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={"bold"}>Unrealized Gains/Loss</Typography>
                  <Typography variant="h6" fontWeight={"bold"} color={GL > 0 ? "green" : "red"}>{GL}</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item container xs={12} justifyContent={"space-between"}>
        <Grid item xs={12} md={3.9} mb={1}>
          <StockInput stockInfo={stockInfo} details={portfolioDetails} inputUpdate={handleInputUpdate} />
        </Grid>
        <Grid item xs={12} md={8} mb={1}>
          <Stocks rows={displayStocks} details={portfolioDetails} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default IndividualPortfolio;

import { Grid, Link, Table, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Stocks from "./components/PortfolioGrid";
import { useLocation } from 'react-router-dom';
import StockInput from "./components/StockInput";

function IndividualPortfolio() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const portfolioName = searchParams.get("portfolioname");
  

  return (

    <Grid container px={5} flexDirection={"column"}>
      <Grid item container mb={2} justifyContent={"space-between"} alignItems={"baseline"}>
        <Typography variant="h5">Portfolio Overview : {portfolioName}</Typography>
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
                <TableCell sx={{ borderRight: "solid 1px lightgray" }}>
                  <Typography fontWeight={"bold"}>Market Value</Typography>
                  <Typography variant="h6" fontWeight={"bold"}>$0</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={"bold"}>Unrealized Gains/Loss</Typography>
                  <Typography variant="h6" fontWeight={"bold"} color={"red"}>-$100,000,000</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item container xs={12} justifyContent={"space-between"}>
        <Grid item xs={12} md={3.9} mb={1}>
          <StockInput />  
        </Grid>
        <Grid item xs={12} md={8} mb={1}>
          <Stocks />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default IndividualPortfolio;

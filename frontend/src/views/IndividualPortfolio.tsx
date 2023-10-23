import { Grid, Table, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Stocks from "./components/PortfolioGrid";

function IndividualPortfolio() {

  return (
    
    <Grid container flexDirection={"column"}>

      <Grid item color={"white"} mb={2}>
        <Typography variant="h5">Portfolio Overview</Typography>
      </Grid>
      <Grid item sx={{ borderRadius: "5px", backgroundColor: "white", marginBottom: "2rem" }} >
        <TableContainer>
          <Table sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: "none",
              textAlign: "center"
            }
          }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{borderRight: "solid 1px grey"}}>
                  <Typography variant="h6" fontWeight={"bold"}>Total</Typography>
                </TableCell>
                <TableCell sx={{borderRight: "solid 1px grey"}}>
                  <Typography fontWeight={"bold"}>Costs</Typography>
                  <Typography variant="h6" fontWeight={"bold"}>$100,000,000</Typography>
                </TableCell>
                <TableCell sx={{borderRight: "solid 1px grey"}}>
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
      
      <Grid item color={"white"} mb={2}>
        <Typography variant="h5">Graph Overview</Typography>
      </Grid>

      <Grid item width={"100%"}>
        <Stocks/>
      </Grid>
    </Grid>
  );
}

export default IndividualPortfolio;

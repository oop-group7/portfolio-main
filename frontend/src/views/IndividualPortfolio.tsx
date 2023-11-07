import { Grid, IconButton, InputBase, Link, Paper, Table, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Stocks from "./components/PortfolioGrid";
import { useLocation } from 'react-router-dom';
import StockInput from "./components/StockInput";
import EditIcon from '@mui/icons-material/Edit';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import { useEffect, useState } from "react";
import { GET } from "../utils/apihelper";

function IndividualPortfolio() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const portfolioId = searchParams.get("portfolioId");
  const [nameEditing, setNameEditing] = useState<boolean>(false);
  const [id, setId] = useState<string | null>(portfolioId);
  const [name, setName] = useState();

  useEffect(() => {
    GET(`/api/portfolio/get/${id}`, {})
      .then((response) => {
        console.log("API Response:", response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, []);


  function handleEnter(e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      setId(e.currentTarget.value)
      setNameEditing(false)
    }
  }

  return (

    <Grid container px={5} flexDirection={"column"}>
      <Grid item container mb={2} justifyContent={"space-between"} alignItems={"baseline"}>
        <Grid item container xs alignItems={"baseline"}>
          <Typography variant="h5">Portfolio Overview:</Typography>
          {!nameEditing ? (
            <>
              <Typography variant="h5" ml={1}>{name}</Typography>
              <IconButton 
                size="small"
                onClick={() => setNameEditing(true)} 
                sx={{ color: "black", boxShadow: 1, backgroundColor: "white", ml: 1, ":hover": { backgroundColor: "whitesmoke" } 
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
                value={name}
                onKeyDown={(e) => {handleEnter(e)}}
                onChange={(e) => {setName(e.currentTarget.value)}}
              />
              <IconButton type="button" onClick={() => setNameEditing(false) } sx={{ p: '10px' }}>
                <SaveAltOutlinedIcon />
              </IconButton>
            </Paper>
          )}
        </Grid>
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

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, InputBase as MuiInputBase, Paper, Select, SelectChangeEvent, styled } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import { ChangeEvent, useEffect, useState } from 'react';
import { PORTFOLIO_LIST } from '../../utils/ticker';


const InputBase = styled(MuiInputBase)({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
})

export default function Stocks(props) {
  const [addedStocks, setAddedStocks] = useState<string>("1")
  const [searched, setSearched] = useState<string>()
  const [price, setPrice] = useState<any>()

  function handleQuantityChange(event: ChangeEvent<HTMLInputElement>) {
    const addedNumber = Number(event.currentTarget.value)
    if (addedNumber < 1) {
      setAddedStocks("1")
    }
    else {
      setAddedStocks(addedNumber.toString())
    }
  }

  function handleAddSubtract(type: string) {
    if (type == "add") {
      setAddedStocks((Number(addedStocks) + 1).toString())
    }
    else {
      if (Number(addedStocks) > 1) {
        setAddedStocks((Number(addedStocks) - 1).toString())
      }
    }
  }

  function handleUpdate() {
    props.inputUpdate({...props.details, desiredStocks: [ ...props.details.desiredStocks, {stockSymbol:searched?.split(":")[0]!.trim(), stockName: searched?.split(":")[1]!.trim(), price: price, quantity: Number(addedStocks)}]})
  }

  useEffect(() => {
    if (searched !== "") {
      const selectedTicker = searched?.split(":")[0]!.trim();
      if (props.stockInfo) {
        const info = props.stockInfo.find((stock) => stock.metadata?.symbol === selectedTicker)
        if (info?.timeSeries) {
          const data = Object.values(info.timeSeries)[0];
          if (data) {
            setPrice(data.open)
          }
        }
      }
    }
  }, [searched])

  return (
    <Box sx={{
      borderRadius: "5px",
      boxShadow: 1,
      width: "100%",
      height: "100%",
      backgroundColor: "white",
      py: 2,
      px: 1
    }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select Stocks</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={searched}
          label="Select Stocks"
          onChange={(e: SelectChangeEvent) => setSearched(e?.target?.value)}
        >
          {PORTFOLIO_LIST.map((portfolioInfo) => (
            <MenuItem value={`${portfolioInfo.symbol} : ${portfolioInfo.name} : ${portfolioInfo.type}`}>{`${portfolioInfo.symbol} : ${portfolioInfo.name}`}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Grid container p={1}>
        <Grid item md={6} xs={3}>Name:</Grid>
        <Grid item md={6} xs={3}>{searched?.split(":")[1]!.trim()}</Grid>
        <Grid item md={6} xs={3}>Symbol:</Grid>
        <Grid item md={6} xs={3}>{searched?.split(":")[0]!.trim()}</Grid>
        <Grid item md={6} xs={3}>Type:</Grid>
        <Grid item md={6} xs={3}>{searched?.split(":")[2]!.trim()}</Grid>
        <Grid item md={6} xs={3}>Price:</Grid>
        <Grid item md={6} xs={3}>{price}</Grid>
      </Grid>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: "flex", alignItems: 'center', border: "solid 1px lightgray", boxShadow: "0", mt: 1, mb: 1 }}
      >
        <IconButton type="button" sx={{ p: '10px' }} onClick={() => handleAddSubtract("subtract")}>
          <RemoveIcon />
        </IconButton>
        <InputBase
          onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault() }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleQuantityChange(e)}
          value={addedStocks}
          type='number'
          sx={{ ml: 1, flex: 1 }}
          placeholder="Enter quantity"
        />
        <IconButton type="button" sx={{ p: '10px' }} onClick={() => handleAddSubtract("add")}>
          <AddIcon />
        </IconButton>
      </Paper>
      <Button variant="contained" onClick={handleUpdate} fullWidth endIcon={<AddCardOutlinedIcon sx={{ ml: 1 }} />}>
        Add to portfolio
      </Button>
    </Box>
  );
}

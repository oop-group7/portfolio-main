/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Grid, IconButton, InputBase as MuiInputBase, Paper, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import React, { ChangeEvent, useState } from 'react';

const stockFields = [
  "Symbol",
  "Name",
  "Type",
  "Region",
  "Market Open",
  "Market Close",
  "Timezone",
  "Currency",
]

const InputBase = styled(MuiInputBase)({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
})

export default function Stocks() {
  const [addedStocks, setAddedStocks] = useState<string>("0")

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const addedNumber = Number(event.currentTarget.value)
    if (addedNumber < 0) {
      setAddedStocks("0")
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
      if (Number(addedStocks) > 0) {
        setAddedStocks((Number(addedStocks) - 1).toString())
      }
    }
  }

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
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: "flex", alignItems: 'center', border: "solid 1px lightgray", boxShadow: "0" }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for stocks"
          onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault()}}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <Grid container p={1}>
        {stockFields.map((field) => {
          return <React.Fragment key={field}>
            <Grid item md={6} xs={3}>{field}:</Grid>
            <Grid item md={6} xs={3}></Grid>
          </React.Fragment>
        })}
      </Grid>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: "flex", alignItems: 'center', border: "solid 1px lightgray", boxShadow: "0", mt: 1, mb: 1 }}
      >
        <IconButton type="button" sx={{ p: '10px' }} onClick={() => handleAddSubtract("subtract")}>
          <RemoveIcon />
        </IconButton>
        <InputBase
          onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault()}}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
          value={addedStocks}
          type='number'
          sx={{ ml: 1, flex: 1 }}
          placeholder="Enter quantity"
        />
        <IconButton type="button" sx={{ p: '10px' }} onClick={() => handleAddSubtract("add")}>
          <AddIcon />
        </IconButton>
      </Paper>
      <Button variant="contained" fullWidth endIcon={<AddCardOutlinedIcon sx={{ ml: 1 }} />}>
        Add to portfolio
      </Button>
    </Box>
  );
}

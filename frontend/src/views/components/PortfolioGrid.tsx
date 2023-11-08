import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React from 'react';

export default function Stocks(props) {

  function getAllocation(params: GridValueGetterParams) {
    return `${Math.trunc((params.row.totalPrice / props.details.utilisedCapitalAmount) * 100)}`
  }

  function getAverageCost(params: GridValueGetterParams) {
    return `$ ${(params.row.totalPrice / params.row.quantity).toFixed(2)}`
  }
  
  const columns: GridColDef[] = [
    { field: 'stockName', headerName: 'Stock Name', flex: 1 / 6, headerAlign: "left" },
    { field: 'quantity', headerName: 'Quantity', flex: 1 / 6, headerAlign: "left" },
    { field: 'allocation', headerName: 'Allocation (%)', flex: 1 / 6, headerAlign: "left", valueGetter: getAllocation },
    { field: 'initialCost', headerName: 'Average Cost ($)', flex: 1 / 6, headerAlign: "left", valueGetter: getAverageCost },
    { field: 'totalPrice', headerName: 'Total Cost', flex: 1 / 6, headerAlign: "left" },
    { field: 'profitLoss', renderHeader: () => (<div><Typography>Unrealized</Typography><Typography>Gain/Loss</Typography></div>), flex: 1 / 6, headerAlign: "left", renderCell: (params) => (<Typography fontWeight={700} color={params.value && params?.value < 0 ? "red" : "green"}>{params?.value ? params.value : 0}</Typography>) }
  ];
  

  // const rows: GridRowsProp = [
  //   { id: 1, stockName: 'Hello', quantity: 'World', totalCost: 100, currentPrice: 1000, marketValue: 999, profitLoss: 10 },
  //   { id: 2, stockName: 'Hello', quantity: 'World', totalCost: 100, currentPrice: 1000, marketValue: 999, profitLoss: -20 },
  //   { id: 3, stockName: 'Hello', quantity: 'World', totalCost: 100, currentPrice: 1000, marketValue: 999, profitLoss: 1000 },
  // ];

  return (
    <React.Fragment>
      <Box sx={{ height: "90vh", width: "100%" }}>
        <DataGrid sx={{
          border: "none",
          boxShadow: 1,
          backgroundColor:
            "white",
          ".MuiTablePagination-displayedRows": {
            "marginTop": "1em",
            "marginBottom": "1em",
          },
          ".MuiDataGrid-columnHeader": {
            "paddingLeft": "1rem",
            "paddingY": "1rem",
          },
          ".MuiDataGrid-cell": {
            "paddingLeft": "1rem",
          },
          width: "100%"
        }} rows={props.rows} rowHeight={75} columns={columns} autoPageSize columnHeaderHeight={70} />
      </Box>
    </React.Fragment>
  );
}

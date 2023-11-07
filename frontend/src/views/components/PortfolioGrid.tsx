import { Box, Link, Typography } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import React from 'react';

const columns: GridColDef[] = [
  { field: 'stockName', headerName: 'Stock Name', flex: 1 / 6, headerAlign: "left" },
  { field: 'quantity', headerName: 'Quantity', flex: 1 / 6, headerAlign: "left" },
  { field: 'quantity', headerName: '% Allocation', flex: 1 / 6, headerAlign: "left" },
  { field: 'totalCost', headerName: 'Average Cost', flex: 1 / 6, headerAlign: "left" },
  { field: 'currentPrice', headerName: 'Total Cost', flex: 1 / 6, headerAlign: "left" },
  { field: 'profitLoss', renderHeader: () => (<div><Typography>Unrealized</Typography><Typography>Gain/Loss</Typography></div>), flex: 1 / 6, headerAlign: "left", renderCell: (params) => (<Typography fontWeight={700} color={params.value && params?.value < 0 ? "red" : "green"}>{params?.value ? params.value : 0}</Typography>) }
];

export default function Stocks() {
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
        }} rows={rows} rowHeight={75} columns={columns} autoPageSize columnHeaderHeight={70} />
      </Box>
    </React.Fragment>
  );
}

import { Box, Link, Typography } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import {components} from "../../utils/api";

import React from 'react';

type Portfolio = components["schemas"]["PortfolioResponse"];

interface PortfoliosProps {
  data: Portfolio[];
}

const columns: GridColDef[] = [
  
  { field: 'portfolioName', headerName: 'Portfolio Name', flex: 1/6, headerAlign: "left", renderCell: (params) => (<Link href={`/portfolio?portfolioId=${params.row.id}`}>{params.value}</Link>)},
  { field: 'utilizedCapital', headerName: 'Utilized Capital', flex: 1/6, headerAlign: "left" },
  { field: 'dateCreated', headerName: 'Date Created', flex: 1/6, headerAlign: "left" },
  { field: 'profitLoss', renderHeader: () => (<div><Typography>Unrealized</Typography><Typography>Gain/Loss</Typography></div>), flex: 1/6, headerAlign: "left", renderCell: (params) => (<Typography fontWeight={700} color={params.value && params?.value < 0 ? "red" : "green"}>{params?.value ? params.value : 0}</Typography>)}
];

export default function Portfolios({ data }: PortfoliosProps) {
  // console.log(data)
  const rows: GridRowsProp = data.map((item, index) => ({
    id: item.id,
    portfolioName: item.name,
    utilizedCapital: item.utilisedCapitalAmount,
    dateCreated: formatDate(item.createdAt),
  }));

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based
    const day = date.getDate().toString().padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }

//const rows: GridRowsProp = [
//   { id: 1, portfolioName: 'Hello', utilizedCapital: 'World', dateCreated: 100, currentPrice: 1000, marketValue: 999, profitLoss: 10 },
//   { id: 2, portfolioName: 'Hello1', utilizedCapital: 'World', dateCreated: 100, currentPrice: 1000, marketValue: 999, profitLoss: -20 },
//   { id: 3, portfolioName: 'Hello3', utilizedCapital: 'World', dateCreated: 100, currentPrice: 1000, marketValue: 999, profitLoss: 1000 },
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

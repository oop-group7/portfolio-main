/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Grid, Typography } from "@mui/material";
import Portfolios from "./components/HompageGrid";
import HomePageHeader from "./components/HomePageHeader";
import { LineChart, PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { GET } from "../utils/apihelper";

const time = [
  new Date(2015, 1, 0),
  new Date(2015, 1, 1),
  new Date(2015, 1, 2),
  new Date(2015, 1, 3),
  new Date(2015, 2, 0),
  new Date(2015, 3, 0),
  new Date(2015, 4, 0),
  new Date(2015, 5, 0),
  new Date(2015, 6, 0),
  new Date(2015, 7, 0),
];

const palette = ["#e86427", "#0d4ea6", "#279c9c", "#279c9c", "#279c9c"]

function HomePage() {
  const [graphMin, setGraphMin] = useState(1);
  const [graphMax, setGraphMax] = useState(10);
  const [portfolios, setPortfolios] = useState();

  useEffect(() => {
    GET("/api/portfolio/getAll", {}).then((response) => {
      console.log(response)
    })
  },[])

  return (
    <Grid container gap={3}>
      <Grid item xs={12}>
        <HomePageHeader />
      </Grid>
      <Grid item sm={12} md={7}>
        <Portfolios />
      </Grid>
      <Grid item container xs justifyContent={"center"} sx={{ minHeight: "30rem", backgroundColor: "white", borderRadius: "3px", boxShadow: 1 }}>
        <Grid item container justifyContent={"center"} flexDirection={"column"}>
          <Typography textAlign={"center"} pt={1}>Portfolio Summary</Typography>
          <Box sx={{ flex: 1 }}>
            <LineChart
              sx={{ width: "100%", flex: 1, cursor: "none" }}
              xAxis={[{
                data: time,
                scaleType: "time",
                tickInterval: "auto",
                min: time?.[0]?.getTime(),
                max: time?.[time.length - 1]?.getTime(),
              }]}
              series={[
                {
                  showMark: false,
                  area: true,
                  color: "#0D4EA6",
                  curve: "linear",
                  data: [2, 5.5, 2, 8.5, 1.5, 5, 10, 1, 2, 3],
                },
              ]}
            />
          </Box>
          <Typography textAlign={"center"} pt={1}>Stock Types</Typography>
          <Box sx={{ flex: 1, my: 1 }}>
            <PieChart
              colors={palette}
              sx={{ width: "100%", flex: 1, cursor: "none" }}
              series={[
                {
                  innerRadius: 50,
                  paddingAngle: 2,
                  cornerRadius: 5,
                  data: [
                    { id: 0, value: 10, label: 'series A' },
                    { id: 1, value: 15, label: 'series B' },
                    { id: 2, value: 20, label: 'series C' },
                  ],
                },
              ]}
            />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default HomePage;

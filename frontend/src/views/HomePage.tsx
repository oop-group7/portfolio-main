import { Box, Grid } from "@mui/material";
import Portfolios from "./components/HompageGrid";
import HomePageHeader from "./components/HomePageHeader";
import { LineChart, PieChart } from "@mui/x-charts";
import { useState } from "react";

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

function HomePage() {
  const [graphMin, setGraphMin] = useState(1);
  const [graphMax, setGraphMax] = useState(10);

  return (
    <Grid container gap={3}>
      <Grid item xs={12}>
        <HomePageHeader />
      </Grid>
      <Grid item sm={12} md={7}>
        <Portfolios />
      </Grid>
      <Grid item container xs justifyContent={"center"} sx={{ minHeight: "30rem", backgroundColor: "white", borderRadius: "3px" }}>
        <Grid item container justifyContent={"center"} flexDirection={"column"}>
          <Box sx={{ flex: 1 }}>
            <LineChart
              sx={{ width: "100%", flex: 1 }}
              xAxis={[{
                data: time,
                scaleType: "time",
                tickInterval: "auto",
                label: "2023",
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
          <Box sx={{ flex: 1 }}>
            <LineChart
              sx={{ width: "100%", flex: 1 }}
              xAxis={[{
                label: "2023",
                min: graphMin,
                max: graphMax,
                data: [1, 2, 3, 5, 8, 10]
              }]}
              series={[
                {
                  area: true,
                  color: "#0D4EA6",
                  curve: "linear",
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
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

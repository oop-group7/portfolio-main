/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Grid, Typography } from "@mui/material";
import Portfolios from "./components/HompageGrid";
import HomePageHeader from "./components/HomePageHeader";
import { BarChart, PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { GET } from "../utils/apihelper";
import { components } from "../utils/api";
import {PORTFOLIO_LIST} from "../utils/ticker"

// const time = [
//   new Date(2015, 1, 0),
//   new Date(2015, 1, 1),
//   new Date(2015, 1, 2),
//   new Date(2015, 1, 3),
//   new Date(2015, 2, 0),
//   new Date(2015, 3, 0),
//   new Date(2015, 4, 0),
//   new Date(2015, 5, 0),
//   new Date(2015, 6, 0),
//   new Date(2015, 7, 0),
// ];

const palette = ["#e86427", "#0d4ea6", "#279c9c", "#279c9c", "#279c9c"]

type Portfolio = components["schemas"]["PortfolioResponse"];

export default function HomePage() {
  const [graphMin, setGraphMin] = useState(1);
  const [graphMax, setGraphMax] = useState(10);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [allocatedCapital, setAllocatedCapital] = useState(0.0);
  const [utilizedCapital, setUtilizedCapital] = useState(0.0);
  const [totalGainLoss, setTotalGainLoss] = useState(0.0);
  const [groupDictionary, setGroupDictionary] = useState<{ key: string, value: number }[]>([]);

  useEffect(() => {
    GET("/api/portfolio/getAll", {})
      .then((response) => {
        console.log("API Response:", response.data);
        setPortfolios(response.data?.portfolios ?? []);
        setAllocatedCapital(response.data?.totalCapitalAmount ?? 0.0);
        setUtilizedCapital(response.data?.totalUtilisedCapitalAmount ?? 0.0);

        const newGroupDictionary: { key: string, value: number }[]= [];

        if (response.data) {
          for (const port of response.data.portfolios) {
            const ds = port?.desiredStocks
            for (const st of ds){
              for (const portfolio of PORTFOLIO_LIST){
                if (portfolio.name == st.stockName){
                  const existingEntry = newGroupDictionary.find((entry) => entry.key === portfolio.type);
                  if (existingEntry) {
                    // If an entry with the same key already exists, update its value
                    existingEntry.value += st.quantity;
                  } else {
                    // If no entry with the same key exists, add a new entry
                    newGroupDictionary.push({ key: portfolio.type, value: st.quantity });
                  }
                }
              }
            }
          }
        }
        setGroupDictionary(newGroupDictionary);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, []);

  // console.log(groupDictionary)
  // console.log(groupDictionary.map((key,i) => ({id : i, value : groupDictionary[i]?.["value"], label : groupDictionary[i]?.["key"]})))

    return (
      <Grid container gap={3}>
        <Grid item xs={12} container justifyContent={"space-between"}>
          <Typography variant="h5">Dashboard</Typography>
          <Button variant={"contained"} href={"/createportfolio"}>Create Portfolio</Button>
        </Grid>
        <Grid item xs={12}>
          <HomePageHeader
            allocatedCapital={allocatedCapital}
            utilizedCapital={utilizedCapital}
          // totalGainLoss={totalGainLoss}
          />
        </Grid>
        <Grid item sm={12} md={7}>
          <Portfolios data={portfolios} />
        </Grid>
        <Grid item container xs justifyContent={"center"} sx={{ minHeight: "30rem", backgroundColor: "white", borderRadius: "3px", boxShadow: 1 }}>
          <Grid item container justifyContent={"center"} flexDirection={"column"}>
            <Typography textAlign={"center"} pt={1}>Portfolio Summary</Typography>
            <Box sx={{ flex: 1 }}>
              <BarChart
                sx={{ width: "100%", flex: 1, cursor: "none" }}
                xAxis={[{ scaleType: 'band', data: portfolios.length > 0 ? portfolios.map((portfolio, i) => i + "." + portfolio.name) : ["1"] }]}
                series={[{data: portfolios.length > 0 ? portfolios.map((portfolio) => portfolio.utilisedCapitalAmount) : [1] }]}
              />
              {/* <LineChart
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
              /> */}
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
                    data: groupDictionary.map((key,i) => ({id : i, value : groupDictionary[i]!["value"], label : groupDictionary[i]?.["key"]}))
                      // { id: 0, value: 10, label: 'series A' },
                      // { id: 1, value: 15, label: 'series B' },
                      // { id: 2, value: 20, label: 'series C' },
                    ,
                  },
                ]}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    );
}

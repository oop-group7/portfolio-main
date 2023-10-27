import { Box, Grid } from "@mui/material";
import Portfolios from "./components/HompageGrid";
import HomePageHeader from "./components/HomePageHeader";
import { SparkLineChart } from "@mui/x-charts";

function HomePage() {

  return (
    <Grid container gap={3}>
      <Grid item xs={12}>
        <HomePageHeader />
      </Grid>
      <Grid item xs={7}>
        <Portfolios />
      </Grid>
      <Grid item container xs justifyContent={"center"}>
        <Grid item container justifyContent={"center"}>
          <Box sx={{ flexGrow: 1 }}>
            <SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} height={100} />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default HomePage;

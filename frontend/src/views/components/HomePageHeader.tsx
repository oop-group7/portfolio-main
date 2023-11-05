import { Card, CardContent, Grid, Typography } from "@mui/material";
import * as Icons from "@mui/icons-material";

type HeaderProps = {
    title?: string,
    content?: string,
    icon: keyof typeof Icons,
}

function HeaderCard(props: HeaderProps) {
    const Icon = Icons[props.icon]
    return (
        <Card sx={{ width: "100%" }}>
            <CardContent>
                <Typography sx={{ fontSize: 15 }} gutterBottom>
                    <Icon style={{ width: "1rem", marginBottom: 3, marginRight: 4}} />{props.title}
                </Typography>
                <Typography sx={{ fontSize: 25, textAlign: "center" }}>
                    {props.content}
                </Typography>
            </CardContent>
        </Card>
    )
}

function HomePage() {

    return (
        <Grid container justifyContent={"space-between"} gap={1}>
            <Grid item xs={3.75}>
                <HeaderCard title={"Allocated Capital"} content={"$100000"} icon={"AttachMoney"}/>
            </Grid>
            <Grid item xs={3.75}>
                <HeaderCard title={"Utilized Capital"} content={"$100000"} icon={"PaidOutlined"}/>
            </Grid>
            <Grid item xs={3.75}>
                <HeaderCard title={"Total Gain/Loss"} content={"$100000"} icon={"TrendingUp"}/>
            </Grid>
        </Grid>
    );
}

export default HomePage;

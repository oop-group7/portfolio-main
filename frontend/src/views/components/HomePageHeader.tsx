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

interface HomePageHeaderProps {
    allocatedCapital: number | undefined;
    utilizedCapital: number | undefined;
}


function HomePage(props: HomePageHeaderProps) {
    return (
        <Grid container justifyContent={"space-between"} gap={1}>
            <Grid item xs={3.75}>
                <HeaderCard title={"Total Capital"} content={`$${props.allocatedCapital}`} icon={"AttachMoney"}/>
            </Grid>
            <Grid item xs={3.75}>
                <HeaderCard title={"Allocated Capital"} content={`$${props.utilizedCapital}`} icon={"PaidOutlined"}/>
            </Grid>
        </Grid>
    );
}

export default HomePage;

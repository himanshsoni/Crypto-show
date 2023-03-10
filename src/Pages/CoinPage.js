import {
  LinearProgress,
  makeStyles,
  Typography,
  Button,
} from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api";
import { numberWithCommas } from "../components/CoinsTable";
import { CryptoState } from "../CryptoContext";

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();

  const { currency, symbol } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(currency, id));

    setCoin(data.coin);
  };
  console.log("beta", coin);
  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    sidebar: {
      width: "30%",
      [theme.breakpoints.down("md")]: {
        width: "100%",
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: "2px solid grey",
    },
    heading: {
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: "Montserrat",
    },
    description: {
      width: "100%",
      fontFamily: "Montserrat",
      padding: 25,
      paddingBottom: 15,
      paddingTop: 0,
      textAlign: "justify",
    },
    marketData: {
      alignSelf: "start",
      padding: 25,
      paddingTop: 10,
      width: "100%",
      [theme.breakpoints.down("md")]: {
        display: "flex",
        justifyContent: "space-around",
      },
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "center",
      },
      [theme.breakpoints.down("xs")]: {
        alignItems: "start",
      },
    },
  }));

  const classes = useStyles();

  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img
          src={coin?.icon}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
      </div>
      <Typography variant="h3" className={classes.heading}>
        {coin?.name}
      </Typography>
      <div className={classes.marketData}>
        <span style={{ display: "flex" }}>
          <Typography variant="h5" className={classes.heading}>
            Rank:
          </Typography>
          &nbsp; &nbsp;
          <Typography
            variant="h5"
            style={{
              fontFamily: "Montserrat",
            }}
          >
            {numberWithCommas(coin?.rank)}
          </Typography>
        </span>

        <span style={{ display: "flex" }}>
          <Typography variant="h5" className={classes.heading}>
            Current Price:
          </Typography>
          &nbsp; &nbsp;
          <Typography
            variant="h5"
            style={{
              fontFamily: "Montserrat",
            }}
          >
            {symbol} {numberWithCommas(coin?.price)}
          </Typography>
        </span>
        <span style={{ display: "flex" }}>
          <Typography variant="h5" className={classes.heading}>
            Market Cap:
          </Typography>
          &nbsp; &nbsp;
          <Typography
            variant="h5"
            style={{
              fontFamily: "Montserrat",
            }}
          >
            {symbol} {numberWithCommas(coin?.marketCap).toString().slice(0, -6)}
            M
          </Typography>
        </span>
        <CoinInfo coin={coin} />
      </div>
    </div>
  );
};

export default CoinPage;

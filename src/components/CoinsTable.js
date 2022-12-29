import {
  Container,
  createTheme,
  TableContainer,
  ThemeProvider,
  Typography,
  LinearProgress,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  makeStyles,
  TableSortLabel,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState("false");
  const { currency, symbol, setCurrency } = CryptoState();
  const [page, setPage] = useState(1);
  const history = useHistory();
  const [rowData, setRowData] = useState([]);
  const sortArray = (arr, orderBy) => {
    console.log("Arr", arr);
    switch (orderBy) {
      case "asc":
      default:
        return arr.sort((a, b) =>
          a.price > b.price ? 1 : b.price > a.price ? -1 : 0
        );
      case "desc":
        return arr.sort((a, b) =>
          a.price < b.price ? 1 : b.price < a.price ? -1 : 0
        );
    }
  };

  const handleSortRequest = (e) => {
    e.preventDefault();
    console.log("e", e.target.value);
    setCoins(sortArray(rowData, orderDirection));
    setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
  };

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    setCoins(data.coins);
    setRowData(data.coins);
    console.log("H", data);
    setLoading(false);
  };
  useEffect(() => {
    fetchCoins();
  }, [currency]);

  console.log("data", rowData);
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const [orderDirection, setOrderDirection] = useState("asc");
  const useStyles = makeStyles({
    row: {
      backgroundColor: "#16171a",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#131111",
      },
      fontFamily: "Montserrat",
    },
    pagination: {
      "& .MuiPaginationItem-root": {
        color: "gold",
      },
    },
  });
  const classes = useStyles();
  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
          Cryptocurrency Prices by Market Cap
        </Typography>
        <TableContainer>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "gold" }} />
          ) : (
            <Table>
              <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                <TableRow>
                  {[
                    "Name",
                    "Price",
                    "Market Cap",
                    "Volume",
                    "Supply",
                    "Price Change(1Hr)",
                    "Price Change(1D)",
                    "Price Change(1W)",
                  ].map((head) => (
                    <TableCell
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}
                      key={head}
                      align={head === "Coin" ? "" : "right"}
                      onClick={handleSortRequest}
                    >
                      <TableSortLabel active={true} direction={orderDirection}>
                        {head}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rowData
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit = parseFloat(row.priceChange1d) > 0;
                    return (
                      <TableRow
                        onClick={() => history.push(`/coins/${row.id}`)}
                        className={classes.row}
                        key={row.name}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                          }}
                        >
                          <img
                            src={row?.icon}
                            alt={row.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: "darkgrey" }}>
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {symbol} {numberWithCommas(row.price.toFixed(2))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            // color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {symbol}
                          {numberWithCommas(row.marketCap)
                            .toString()
                            .slice(0, -6)}
                          M
                        </TableCell>
                        <TableCell align="right">
                          {symbol} {row.volume.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {row.availableSupply}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            fontWeight: 500,
                          }}
                        >
                          {" "}
                          {row.priceChange1h} {"%"}
                        </TableCell>
                        <TableCell align="right">
                          {row.priceChange1d} {"%"}
                        </TableCell>
                        <TableCell align="right">
                          {row.priceChange1w} {"%"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination
          count={(coins.length / 10).toFixed(2)}
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;

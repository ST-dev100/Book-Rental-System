import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
} from "@mui/material";
import BookStatusTable from "../Components/BookStatusTable";
import AvailableBooks from "../Components/AvailableBooksChart";
import EarningSummary from "../Components/EarningSummary";

const OwnerFront = () => {
  return (
    <Box flexGrow={1} display={"flex"} gap={1}>
      <Box
        flexGrow={1}
        display={"flex"}
        flexDirection={"column"}
        gap={2}
        sx={{ backgroundColor: "white" }}
      >
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", marginBottom: 1 }}
            >
              This Month Statistics
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginBottom: 2 }}
            >
              Tue, 14 Nov, 2024, 11.30 AM
            </Typography>
            <Box
              sx={{ backgroundColor: "#F5F5F5", borderRadius: 2, padding: 2 }}
            >
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginBottom: 1 }}
              >
                Income{" "}
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    marginLeft: 1,
                    backgroundColor: "#E0E0E0",
                    color: "#000",
                    textTransform: "none",
                  }}
                >
                  This Month
                </Button>
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", marginBottom: 1 }}
              >
                ETB 9460.00{" "}
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ color: "red", marginLeft: 1 }}
                >
                  ↓ 1.5%
                </Typography>
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginBottom: 1 }}
              >
                Compared to ETB9940 last month
              </Typography>
              <Divider sx={{ marginY: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Last Month Income{" "}
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ fontWeight: "normal", marginLeft: 1 }}
                >
                  ETB 25658.00
                </Typography>
              </Typography>
            </Box>
          </CardContent>
        </Card>
        <AvailableBooks />
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={1}
        marginTop={-1}
        marginRight={1}
      >
        <BookStatusTable/>
        <EarningSummary />
      </Box>
    </Box>
  );
};

export default OwnerFront;

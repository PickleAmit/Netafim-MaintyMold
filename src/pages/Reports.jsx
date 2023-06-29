import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTypeCounts,
  fetchCountsByTechnician,
  fetchAverageResolutionTime,
  fetchCountByPriority,
  fetchMostCommon,
  fetchAverageResolutionByErrorType,
  fetchAverageResolutionByTechnician,
  selectTypeCounts,
  selectCountsByTechnician,
  selectAverageResolutionTime,
  selectCountByPriority,
  selectMostCommon,
  selectAverageResolutionByErrorType,
  selectAverageResolutionByTechnician,
} from "../features/dashboardSlice";
import { DatePicker } from "@mui/x-date-pickers";
import {
  CircularProgress,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Select,
  Button,
  Divider,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  ResponsiveContainer,
  LabelList,
  Cell,
  Legend,
} from "recharts";
import "./reports.css";
import dayjs from "dayjs";

const CHART_DIMENSIONS = {
  height: 200,
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#353750",
]; // Add more colors if required

const PRIORITY_COLORS = {
  Red: "#FF0000", // this is an example color
  Yellow: "#FFBB28",
  Green: "#008000",
  "ללא עדיפות": "#353750", // this is an example color
};

const Reports = () => {
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const [selectedFilter, setSelectedFilter] = React.useState("technicians");
  const [selectedTimePeriod, setSelectedTimePeriod] = React.useState("all");
  const mode = useSelector((state) => state.user.mode);

  // Selectors
  const typeCounts = useSelector(selectTypeCounts);
  const countsByTechnician = useSelector(selectCountsByTechnician);
  const averageResolutionTime = useSelector(selectAverageResolutionTime);
  const countByPriority = useSelector(selectCountByPriority);
  const mostCommon = useSelector(selectMostCommon);
  const averageResolutionByErrorType = useSelector(
    selectAverageResolutionByErrorType
  );
  const averageResolutionByTechnician = useSelector(
    selectAverageResolutionByTechnician
  );

  useEffect(() => {
    console.log("useEffect is working");
    const startDate = dayjs(selectedDate).format("YYYY-MM-DD"); // Added

    dispatch(fetchTypeCounts({ startDate, timePeriod: selectedTimePeriod }));
    dispatch(
      fetchCountsByTechnician({ startDate, timePeriod: selectedTimePeriod })
    );
    dispatch(
      fetchAverageResolutionTime({ startDate, timePeriod: selectedTimePeriod })
    );
    dispatch(
      fetchCountByPriority({ startDate, timePeriod: selectedTimePeriod })
    );
    dispatch(fetchMostCommon({ startDate, timePeriod: selectedTimePeriod }));
    dispatch(
      fetchAverageResolutionByErrorType({
        startDate,
        timePeriod: selectedTimePeriod,
      })
    );
    dispatch(
      fetchAverageResolutionByTechnician({
        startDate,
        timePeriod: selectedTimePeriod,
      })
    );
  }, [dispatch, selectedDate, selectedTimePeriod]); // Added dependencies

  const typeCountsData = typeCounts.data.map((item) => ({
    name: item.ErrorType,
    value: item.Count,
  }));

  const countsByTechnicianData = countsByTechnician.data.map((item) => ({
    name: item.TechnicianName,
    value: item.Count,
  }));

  const countByPriorityData = countByPriority.data.map((item) => ({
    name: item.Priority ? item.Priority : "ללא עדיפות",
    value: item.Count,
  }));

  const mostCommonData = mostCommon.data.map((item) => ({
    name: item.Description,
    value: item.Count,
  }));

  const averageResolutionByErrorTypeData =
    averageResolutionByErrorType.data.map((item) => ({
      name: item.ErrorType,
      value: item.AverageResolutionTime,
    }));

  const averageResolutionByTechnicianData =
    averageResolutionByTechnician.data.map((item) => ({
      name: item.Technician,
      value: item.AverageResolutionTime,
    }));
  // slice the labels
  const formatXAxis = (tickItem) => {
    return tickItem.length > 7 ? `...${tickItem.slice(0, 4)}` : tickItem;
  };

  // Create a reusable chart component
  const ChartComponent = ({ data, title, color, tooltipLabelFormatter }) => (
    <Paper className="chart_paper">
      <Typography className="chart_title" variant="h5">
        {title}
      </Typography>
      {data.loading === "loading" ? (
        <CircularProgress />
      ) : data.error ? (
        <Typography color="error">{data.error}</Typography>
      ) : !Array.isArray(data.data) || data.data.length === 0 ? (
        <Typography>No data available</Typography>
      ) : (
        <ResponsiveContainer width="100%" height={CHART_DIMENSIONS.height}>
          <BarChart
            data={data.data}
            margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
          >
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              interval={0}
              tickFormatter={formatXAxis}
            />

            <YAxis />
            <Tooltip labelFormatter={tooltipLabelFormatter} />
            <Bar dataKey="value">
              {data.data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
              <LabelList dataKey="value" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );

  const periodOptions = [
    { value: "all", label: "כל הזמן" },
    { value: "day", label: "יום" },
    { value: "week", label: "שבוע" },
    { value: "month", label: "חודש" },
  ];

  return (
    <div style={{ width: "100%" }}>
      <div className="dashboard_headerFirst">
        <Typography variant="h6" sx={{ color: "black" }}>
          מסך דוחות
        </Typography>
      </div>
      <div className="dashboard_header">
        {periodOptions.map((option) => (
          <Button
            key={option.value}
            variant="h6"
            sx={{
              borderRadius: "10px",
              border:
                selectedTimePeriod === option.value ? "2px solid" : "1px solid",
              borderColor:
                selectedTimePeriod === option.value
                  ? "cornflowerblue"
                  : "black",
              padding: "5px 10px",
              margin: "3px",
              width: "100%",
              transition: "background-color 0.3s ease",
              ":active": { backgroundColor: "cornflowerblue" },
            }}
            // className={selectedTimePeriod === option.value ? "selected" : ""}
            onClick={() => setSelectedTimePeriod(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <div className="dashboard_datepicker">
        <DatePicker
          label="בחר תאריך"
          value={selectedDate}
          views={["day"]}
          onChange={(date) => setSelectedDate(date)}
        />

        <Select
          value={selectedFilter}
          onChange={(event) => setSelectedFilter(event.target.value)}
        >
          <MenuItem value="technicians">טכנאים</MenuItem>
          <MenuItem value="resolutionTime">זמן טיפול</MenuItem>
          <MenuItem value="errorType">סוג תקלה</MenuItem>
          <MenuItem value="priority">עדיפות</MenuItem>
          {/* Add more MenuItems as needed */}
        </Select>
      </div>
      <div className="content-padding">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <ResponsiveContainer width="100%" height={CHART_DIMENSIONS.height}>
              <PieChart margin={{ top: 20, right: 0, left: 0, bottom: 10 }}>
                <Pie
                  dataKey="value"
                  nameKey="name"
                  data={typeCountsData}
                  cx="50%"
                  cy="50%"
                  fill="#353750"
                  // paddingAngle={5}
                  labelLine={true}
                  label={({ name, value }) => `${name}: ${value}`}
                ></Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {selectedFilter === "technicians" && (
              <ChartComponent
                data={{
                  loading: countsByTechnician.loading,
                  data: countsByTechnicianData,
                  error: countsByTechnician.error,
                }}
                title="כמות תקלות טכנאים"
                color={COLORS[0]}
                tooltipLabelFormatter={(value) => `טכנאי: ${value}`}
              />
            )}
            <Divider
              fullWidth
              sx={{
                margin: "1em 0",
                borderColor: mode === "dark" ? "white" : "black",
              }}
            />
            <Typography className="rtl" variant="h5">
              זמן טיפול ממוצע לתקלה
            </Typography>
            {averageResolutionTime?.data?.AverageResolutionTime !== null &&
            averageResolutionTime?.data?.AverageResolutionTime !== undefined ? (
              <u>
                <Typography className="rtl">
                  {averageResolutionTime.data.AverageResolutionTime < 24
                    ? `${Number(
                        averageResolutionTime.data.AverageResolutionTime
                      ).toFixed(2)} שעות`
                    : `${Math.floor(
                        averageResolutionTime.data.AverageResolutionTime / 24
                      )} ימים 
                      ${(
                        averageResolutionTime.data.AverageResolutionTime % 24
                      ).toFixed(2)} שעות`}
                </Typography>
              </u>
            ) : (
              <Typography>No data available</Typography>
            )}
            <Divider
              fullWidth
              sx={{
                marginTop: "1em",
                borderColor: mode === "dark" ? "white" : "black",
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            {selectedFilter === "priority" && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={countByPriorityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {countByPriorityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PRIORITY_COLORS[entry.name]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
            {selectedFilter === "errorType" && (
              <ChartComponent
                data={{
                  loading: mostCommon.loading,
                  data: mostCommonData,
                  error: mostCommon.error,
                }}
                title="התקלות הנפוצות ביותר"
                color={COLORS[4]}
                tooltipLabelFormatter={(value) => `סוג תקלה: ${value}`}
              />
            )}
            {selectedFilter === "resolutionTime" && (
              <ChartComponent
                data={{
                  loading: averageResolutionByErrorType.loading,
                  data: averageResolutionByErrorTypeData.map((item) => {
                    return {
                      ...item,
                      value: Number((item.value / 60).toFixed(2)), // Divide by 60 to convert minutes to hours, keep 2 decimal places, and convert back to number
                    };
                  }),
                  error: averageResolutionByErrorType.error,
                }}
                title="זמן טיפול ממוצע לפי סוג תקלה"
                color={COLORS[5]}
                tooltipLabelFormatter={(value) => `סוג טיפול: ${value}`}
              />
            )}
            {selectedFilter === "resolutionTime" && (
              <ChartComponent
                data={{
                  loading: averageResolutionByTechnician.loading,
                  data: averageResolutionByTechnicianData.map((item) => {
                    return {
                      ...item,
                      value: Number((item.value / 60).toFixed(2)), // Divide by 60 to convert minutes to hours, keep 2 decimal places, and convert back to number
                    };
                  }),
                  error: averageResolutionByTechnician.error,
                }}
                title="זמן ממוצע לטיפול טכנאים"
                color={COLORS[1]}
                tooltipLabelFormatter={(value) => `טכנאי: ${value}`}
              />
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Reports;

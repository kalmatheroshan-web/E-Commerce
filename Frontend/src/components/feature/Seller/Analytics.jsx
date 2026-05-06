import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { useSelector } from 'react-redux';

export default function Analytics() {
  const margin = { right: 24 };
  const { orders } = useSelector(state => state.orders);

  //  Total Revenue
  const revenue = orders?.reduce((acc, order) => {
    return acc + order.totalAmount;
  }, 0);

  //  Total Units (FIXED)
  const unit = orders?.reduce((acc, order) => {
    return (
      acc +
      order.products.reduce((sum, p) => sum + p.quantity, 0)
    );
  }, 0);

  //  Earliest Date
  const earliest = orders?.reduce((earliest, cur) => {
    const currentDate = new Date(cur.updatedAt);
    return currentDate < earliest ? currentDate : earliest;
  }, new Date());

  console.log("Earliest:", earliest);
  console.log("Orders:", orders);

  //  Monthly Aggregation
  const monthlyData = new Array(12).fill(0).map(() => ({
    revenue: 0,
    units: 0,
  }));

  orders?.forEach(order => {
    const date = new Date(order.updatedAt);
    const month = date.getMonth();

    // Revenue
    monthlyData[month].revenue += order.totalAmount;

    // Units
    const units = order.products.reduce(
      (sum, p) => sum + p.quantity,
      0
    );
    monthlyData[month].units += units;
  });

  const pData = monthlyData.map(m => m.revenue);
  const uData = monthlyData.map(m => m.units);

  //  Labels
  const xLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div className="bg-gray-50 p-2 rounded-2xl flex flex-col lg:flex-row gap-4">

      {/* LEFT CARDS */}
      <div className="flex flex-col gap-4 w-full lg:w-[320px]">
        {/* Revenue Card */}
        <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="h-[4px] bg-green-500 w-12 rounded-full mb-4"></div>

          <h2 className="text-lg">Total Revenue</h2>
          <div className="text-3xl font-bold text-gray-900 mt-1">
            ₹{revenue}
          </div>

          <div className="flex justify-between gap-2 mt-5">
            <Stat label="Last Year" color="green" value="+33%" />
            <Stat label="Last Month" color="yellow" value="+33%" />
            <Stat label="Last Week" color="red" value="-33%" />
          </div>
        </div>

        {/* Volume Card */}
        <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="h-[4px] bg-indigo-500 w-12 rounded-full mb-4"></div>

          <h2 className="text-lg">Total Volume</h2>
          <div className="text-3xl font-bold text-gray-900 mt-1">
            {unit} Units
          </div>

          <div className="flex justify-between mt-5">
            <Stat label="Last Year" color="green" value="+12%" />
            <Stat label="Last Month" color="yellow" value="+12%" />
            <Stat label="Week" color="red" value="-12%" />
          </div>
        </div>

      </div>

      {/* CHART */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 w-full">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Analytics Overview
        </h2>
        <Box sx={{ width: '100%', height: { xs: 250, sm: 300, md: 320 } }}>
          <LineChart
            series={[
              { data: pData, label: 'Revenue', color: '#2F2FE4' },
              { data: uData, label: 'Units', color: "#FFA02E" },
            ]}
            xAxis={[{ scaleType: 'point', data: xLabels }]}
            yAxis={[{ width: 50 }]}
            margin={margin}
          />
        </Box>
      </div>

    </div>
  );
}

const Stat = ({ label, color, value }) => {
  const bg = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="text-center">
      <div className={`${bg[color]} text-sm font-semibold px-3 py-2 rounded-md`}>
        <p>{value}</p>
        <MiniBars color={`bg-${color}-700`} />
      </div>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
};

const MiniBars = ({ color }) => {
  return (
    <div className="flex items-center gap-[2px] mt-2">
      {new Array(11).fill(0).map((_, idx) => {
        const isHighlight = idx === 4 || idx === 5;

        return (
          <div
            key={idx}
            className={`w-[2.5px] ${isHighlight ? `${color} h-${idx - 2}` : 'bg-gray-300 h-2'
              }`}
          />
        );
      })}
    </div>
  );
};
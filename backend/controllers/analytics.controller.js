import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

export const getAnalyticsData = async () => {
  // Placeholder for actual analytics data fetching logic
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // Grouping all documents together
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
      },
    },
  ]);
  const { totalSales, totalRevenue, totalOrders } = salesData[0] || { totalSales: 0, totalRevenue: 0, totalOrders: 0 };
  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
    totalOrders,
  };
};

export const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    //   [
    //     {
    //       _id: "2026-01-29",
    //       sales: 12,
    //       revenue: 1450.75,
    //     },
    //     {
    //       _id: "2026-01-28",
    //       sales: 9,
    //       revenue: 1000.0,
    //     },
    //   ];
    const dateArray = getDateInRange(startDate, endDate);
    return dateArray.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date.toISOString().split("T")[0]);
      return {
        date: date.toISOString().split("T")[0],
        sales: foundData ? foundData.sales : 0,
        revenue: foundData ? foundData.revenue : 0,
      };
    });
  } catch (error) {
    console.error("Error fetching daily sales data:", error);
    throw error;
  }
};

function getDateInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

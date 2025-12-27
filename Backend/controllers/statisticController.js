const Stats = require("../models/statisticModel");

const getDashboardStats = async (req, res) => {
    try {
        const { year, startDate, endDate } = req.query;

        const [overview, gender, age, movement, monthlyTrend] = await Promise.all([
            Stats.getOverview(),
            Stats.getResidentStatsByGender(),
            Stats.getResidentStatsByAge(),
            Stats.getMovementStats(startDate, endDate),
            Stats.getMonthlyTrend(year)
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview,
                demographic: { gender, age },
                charts: {
                    residentRates: {
                        ThuongTru: overview.thuongtru,
                        TamTru: overview.tamtru,
                        TamVang: overview.tamvang
                    },
                    monthlyTrend
                },
                movement
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack
        });
    }
};

// ĐẢM BẢO EXPORT ĐÚNG TÊN
module.exports = {
    getDashboardStats
};
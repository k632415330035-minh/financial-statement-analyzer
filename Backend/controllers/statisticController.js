const { statisticModel: Stats } = require("../models/statisticModel");

const statisticController = async (req, res) => {
    try {
        const { year, startDate, endDate } = req.query;

        const [overview, gender, age, movement, monthlyTrend] = await Promise.all([
            Stats.getOverview(),
            Stats.getResidentStatsByGender(),
            Stats.getResidentStatsByAge(),
            Stats.getMovementStats(startDate, endDate),
            Stats.getMonthlyTrend(year)
        ]);

        const totalNhanKhau = overview?.nhankhau || 0;
        const totalTamTru = overview?.tamtru || 0;
        const totalTamVang = overview?.tamvang || 0;

        const response = {
            success: true,
            data: {
                overview,

                demographic: {
                    gender,
                    age
                },

                charts: {
                    residentRates: {
                        ThuongTru: totalNhanKhau - totalTamTru,
                        TamTru: totalTamTru,
                        TamVang: totalTamVang
                    },
                    monthlyTrend: monthlyTrend
                },

                movement
            }
        };

        res.status(200).json(response);

    } catch (error) {
        console.error("Lỗi trong statisticController:", error);
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ nội bộ.",
        });
    }
}

module.exports = {
    getDashboardStats: statisticController
};
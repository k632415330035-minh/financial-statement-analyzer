const Stats = require("../models/statisticModel");

const getDashboardStats = async (req, res) => { // Đổi tên biến cho rõ ràng
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
                        ThuongTru: overview.nhankhau,
                        TamTru: overview.tamtru,
                        TamVang: overview.tamvang
                    },
                    monthlyTrend
                },
                movement
            }
        });
    } catch (error) {
        console.error("LỖI CHI TIẾT TẠI ĐÂY:", error); // Dòng này sẽ in ra lỗi thật ở màn hình CMD/Terminal
        res.status(500).json({
            success: false,
            message: error.message, // Trả về lỗi thật thay vì câu "Lỗi máy chủ nội bộ"
            stack: error.stack
        });
    }
};

// ĐẢM BẢO EXPORT ĐÚNG TÊN
module.exports = {
    getDashboardStats
};
const ManageAbsent = require('../models/manageabsentModel');

exports.getDashboard = async (req, res) => {
    try {
        const [stats, records] = await Promise.all([
            ManageAbsent.getStats(),
            ManageAbsent.getAll()
        ]);

        res.json({
            success: true,
            data: {
                total: stats.total || 0,
                active: stats.active || 0,
                expired: stats.expired || 0,
                records: records
            }
        });
    } catch (error) {
        console.error("Lỗi ManageAbsent Controller:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
};
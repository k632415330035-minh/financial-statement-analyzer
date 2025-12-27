const ResidentManage = require('../models/residentManageModel');

exports.getDashboardData = async (req, res) => {
    try {
        const [stats, residents] = await Promise.all([
            ResidentManage.getStats(),
            ResidentManage.getAll()
        ]);

        res.json({
            success: true,
            data: {
                stats: stats,
                residents: residents
            }
        });
    } catch (error) {
        console.error("Lỗi ResidentManage Controller:", error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
};
exports.updateResident = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const success = await ResidentManage.update(id, updateData);
        if (success) {
            res.json({ success: true, message: "Cập nhật thành công" });
        }
    } catch (error) {
        console.error("Lỗi cập nhật nhân khẩu:", error);
        res.status(500).json({ success: false, message: "Không thể cập nhật dữ liệu" });
    }
};
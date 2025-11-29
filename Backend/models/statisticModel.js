const db = require("../config/dbMySQL");

const statisticModel = {
  getOverview: async () => {
    try {
      const [
        [hokhau],
        [nhankhau],
        [tamtru],
        [tamvang],
      ] = await Promise.all([
        db.query("SELECT COUNT(*) AS total FROM ho_khau"),
        db.query("SELECT COUNT(cccd) AS total FROM cong_dan"),
        db.query("SELECT COUNT(*) AS total FROM tam_thuong_tru where _type = 'tam tru' and state = 'da duyet' and end >=CURDATE() "),
        db.query("SELECT COUNT(*) AS total FROM tam_vang ")
      ]);
      return {
        hokhau: hokhau[0].total,
        nhankhau: nhankhau[0].total,
        tamtru: tamtru[0].total,
        tamvang: tamvang[0].total,
      };
    } catch (error) {
      throw error;
    }
  },
  getResidentStatsByGender: async () => {
    const query = `
    SELECT gioi_tinh, COUNT(*) AS count from cong_dan GROUP BY gioi_tinh
    `;
    const [rows] = await db.query(query);

    let male = 0;
    let female = 0;

    rows.forEach(row => {
      if (row.gioi_tinh === 'Nam') male = row.count;
      else female = row.count;
    });

    const total = male + female;
    return {
      male,
      female,
      total,
      malePercentage: total ? ((male / total) * 100).toFixed(1) : 0,
      femalePercentage: total ? ((female / total) * 100).toFixed(1) : 0,
    };
  },
  getResidentStatsByAge: async () => {
    const [ageConfig] = await db.query("SELECT * FROM do_tuoi");

    const [residents] = await db.query("SELECT ngay_sinh FROM cong_dan");

    const stats = ageConfig.map(config => ({
      group: config.name_age,
      count: 0,
      percent: 0,
    }));

    const currentYear = new Date().getFullYear();

    residents.forEach(resident => {
      if (!resident.ngay_sinh) return;
      const birthYear = new Date(resident.ngay_sinh).getFullYear();
      const age = currentYear - birthYear;

      const matchingGroup = ageConfig.find(config => age >= config._from && age <= config._to);
      if (matchingGroup) {
        const stat = stats.find(s => s.group === matchingGroup.name_age);
        if (stat) stat.count += 1;
      }
    });
    const totalPeople = residents.length;
    stats.forEach(stat => {
      stat.percent = totalPeople ? ((stat.count / totalPeople) * 100).toFixed(1) : 0;
    });
    return stats;
  },
  getMonthlyTrend: async (year) => {
    const targetYear = year || new Date().getFullYear();

    const query = `
            SELECT 
                months.m AS month,
                
              
                (SELECT COUNT(*) FROM nhan_khau 
                 WHERE ngay_dang_ki_thuong_tru <= LAST_DAY(CONCAT(?, '-', months.m, '-01'))) 
                 AS count_thuong_tru,

                (SELECT COUNT(*) FROM tam_thuong_tru 
                 WHERE _type = 'tam tru' AND state = 'da duyet'
                 AND begin <= LAST_DAY(CONCAT(?, '-', months.m, '-01'))
                 AND end >= CONCAT(?, '-', months.m, '-01')) 
                 AS count_tam_tru,

                (SELECT COUNT(*) FROM tam_vang 
                 WHERE date_time <= LAST_DAY(CONCAT(?, '-', months.m, '-01'))) 
                 AS count_tam_vang

            FROM 
                -- Tạo bảng giả 12 tháng để join
                (SELECT 1 AS m UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
                 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 
                 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) AS months
        `;
    try {
      const [rows] = await db.query(query, [targetYear, targetYear, targetYear, targetYear]);

      const result = rows.map(row => {
        const totalPopulation = (row.count_thuong_tru + row.count_tam_tru) - row.count_tam_vang;

        return {
          month: `T${row.month}`,
          count: totalPopulation,
          details: {
            thuongTru: row.count_thuong_tru,
            tamTru: row.count_tam_tru,
            tamVang: row.count_tam_vang
          }
        };
      });

      return result;

    } catch (error) {
      console.error("Lỗi tính biến động dân số:", error);
      throw error;
    }
  },
  getMovementStats: async (startDate, endDate) => {
    const start = startDate || '2024-01-01';
    const end = endDate || '2024-12-31';

    const [tamTru] = await db.query(
      `SELECT COUNT(*) AS count FROM tam_thuong_tru WHERE _type = 'tam tru' AND state = 'da duyet' AND begin >= ? AND end <= ?`,
      [start, end]
    )
    const [tamVang] = await db.query(
      `SELECT COUNT(*) AS count FROM tam_vang WHERE date_time between ? AND ?`,
      [start, end]
    );
    return {
      fromDate: start,
      toDate: end,
      tamTru: tamTru[0].count,
      tamVang: tamVang[0].count,
    };
  }


}

module.exports = {
  statisticModel,
};

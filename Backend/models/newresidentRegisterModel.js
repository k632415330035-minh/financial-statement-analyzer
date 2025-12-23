const db = require("../config/dbMySQL");

const getHouseByHouseholderCCCD = async (cccdChuHo) => {
  const sql = `
      SELECT 
        nk.id_ho_khau,
        hk.address,
        hk._type,
        CASE 
          WHEN hk._type = 'Tạm trú' THEN (
              SELECT DATE_FORMAT(MAX(dk.end), '%Y-%m-%d') 
              FROM don_dang_ky dk 
              WHERE dk.id_ho_khau = hk.id_ho_khau
          )
          ELSE NULL 
        END as latest_end
    FROM cong_dan cd
    JOIN nhan_khau nk ON cd.id_cd = nk.id_cd
    JOIN ho_khau hk ON nk.id_ho_khau = hk.id_ho_khau
    WHERE cd.cccd = ?
      AND nk.quan_he_voi_chu_ho = 'Chủ hộ'
    LIMIT 1
  `;

  const [rows] = await db.execute(sql, [cccdChuHo]);
  return rows.length > 0 ? rows[0] : null;
};

const registerExistingHouse = async (cccdChuHo, donDangKy, people) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const houseInfo = await getHouseByHouseholderCCCD(cccdChuHo);
    if (!houseInfo) {
      throw new Error("CCCD chủ hộ không hợp lệ hoặc không phải chủ hộ");
    }

    const { id_ho_khau, address, _type: houseType } = houseInfo;
    const peopleWithIdCd = [];

    for (const person of people) {
      let id_cd = null;

      if (person.cccd) {
        const [existRows] = await conn.execute(
          `SELECT id_cd FROM cong_dan WHERE cccd = ? LIMIT 1`,
          [person.cccd]
        );

        if (existRows.length > 0) {
          id_cd = existRows[0].id_cd;
        } else {
          const linkedUserID = person.isApplicant ? person.cccd : null;
          const [rs] = await conn.execute(
            `
            INSERT INTO cong_dan (
              cccd, ho_ten, bi_danh, gioi_tinh, ngay_sinh,
              noi_sinh, que_quan, dan_toc, nghe_nghiep,
              noi_lam_viec, noi_cap, ngay_cap, userID
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
              person.cccd,
              person.ho_ten,
              person.bi_danh || null,
              person.gioi_tinh,
              person.ngay_sinh,
              person.noi_sinh,
              person.que_quan,
              person.dan_toc,
              person.nghe_nghiep,
              person.noi_lam_viec,
              person.noi_cap || null,
              person.ngay_cap || null,
              linkedUserID,
            ]
          );
          id_cd = rs.insertId;
        }
      } else {
        const [rs] = await conn.execute(
          `
          INSERT INTO cong_dan (
            cccd, ho_ten, bi_danh, gioi_tinh, ngay_sinh,
            noi_sinh, que_quan, dan_toc, nghe_nghiep,
            noi_lam_viec, noi_cap, ngay_cap, userID
          )
          VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL)
          `,
          [
            person.ho_ten,
            person.bi_danh || null,
            person.gioi_tinh,
            person.ngay_sinh,
            person.noi_sinh,
            person.que_quan,
            person.dan_toc,
            person.nghe_nghiep,
            person.noi_lam_viec,
          ]
        );
        id_cd = rs.insertId;
      }

      peopleWithIdCd.push({ ...person, id_cd });
    }

    const applicants = peopleWithIdCd.filter((p) => p.isApplicant);
    if (applicants.length !== 1) {
      throw new Error("Phải có đúng 1 người điền đơn");
    }
    const applicant = applicants[0];

    const dateTime = new Date();
    const begin = houseType === "Thường trú" ? dateTime : donDangKy.begin;
    const end = houseType === "Thường trú" ? null : donDangKy.end;

    const [dkRs] = await conn.execute(
      `
      INSERT INTO don_dang_ky (
        date_time, begin, end, _type,
        address, state, ngay_duyet, ly_do_tu_choi, id_cd, id_ho_khau
      )
      VALUES (?, ?, ?, ?, ?, 'Chưa duyệt', NULL, NULL, ?, ?)
      `,
      [dateTime, begin, end, houseType, address, applicant.id_cd, id_ho_khau]
    );

    const id_dk = dkRs.insertId;

    const values = peopleWithIdCd.map((p) => [
      id_dk,
      p.id_cd,
      p.quan_he_voi_chu_ho,
      p.thuong_tru_truoc_day,
    ]);

    await conn.query(
      `
      INSERT INTO chi_tiet_don
      (id_dk, id_cd, quan_he_voi_chu_ho, thuong_tru_truoc_day)
      VALUES ?
      `,
      [values]
    );

    await conn.commit();
    return { success: true, id_dk };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const registerNewHouse = async (donDangKy, people) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const peopleWithIdCd = [];

    for (const person of people) {
      let id_cd = null;

      if (person.cccd) {
        const [existRows] = await conn.execute(
          `SELECT id_cd FROM cong_dan WHERE cccd = ? LIMIT 1`,
          [person.cccd]
        );

        if (existRows.length > 0) {
          id_cd = existRows[0].id_cd;
        } else {
          const linkedUserID = person.isApplicant ? person.cccd : null;
          const [rs] = await conn.execute(
            `
            INSERT INTO cong_dan (
              cccd, ho_ten, bi_danh, gioi_tinh, ngay_sinh,
              noi_sinh, que_quan, dan_toc, nghe_nghiep,
              noi_lam_viec, noi_cap, ngay_cap, userID
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
              person.cccd,
              person.ho_ten,
              person.bi_danh || null,
              person.gioi_tinh,
              person.ngay_sinh,
              person.noi_sinh,
              person.que_quan,
              person.dan_toc,
              person.nghe_nghiep,
              person.noi_lam_viec,
              person.noi_cap || null,
              person.ngay_cap || null,
              linkedUserID,
            ]
          );
          id_cd = rs.insertId;
        }
      } else {
        const [rs] = await conn.execute(
          `
          INSERT INTO cong_dan (
            cccd, ho_ten, bi_danh, gioi_tinh, ngay_sinh,
            noi_sinh, que_quan, dan_toc, nghe_nghiep,
            noi_lam_viec, noi_cap, ngay_cap, userID
          )
          VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL)
          `,
          [
            person.ho_ten,
            person.bi_danh || null,
            person.gioi_tinh,
            person.ngay_sinh,
            person.noi_sinh,
            person.que_quan,
            person.dan_toc,
            person.nghe_nghiep,
            person.noi_lam_viec,
          ]
        );
        id_cd = rs.insertId;
      }

      peopleWithIdCd.push({ ...person, id_cd });
    }

    const applicants = peopleWithIdCd.filter((p) => p.isApplicant);
    if (applicants.length !== 1) {
      throw new Error("Phải có đúng 1 người điền đơn");
    }
    const applicant = applicants[0];

    const dateTime = new Date();
    const begin = donDangKy._type === "Thường trú" ? dateTime : donDangKy.begin;
    const end = donDangKy._type === "Thường trú" ? null : donDangKy.end;

    const [dkRs] = await conn.execute(
      `
      INSERT INTO don_dang_ky (
        date_time, begin, end, _type,
        address, state, ngay_duyet, ly_do_tu_choi, id_cd, id_ho_khau
      )
      VALUES (?, ?, ?, ?, ?, 'Chưa duyệt', NULL, NULL, ?, NULL)
      `,
      [
        dateTime,
        begin,
        end,
        donDangKy._type,
        donDangKy.address,
        applicant.id_cd,
      ]
    );

    const id_dk = dkRs.insertId;

    const values = peopleWithIdCd.map((p) => [
      id_dk,
      p.id_cd,
      p.quan_he_voi_chu_ho,
      p.thuong_tru_truoc_day,
    ]);

    await conn.query(
      `
      INSERT INTO chi_tiet_don
      (id_dk, id_cd, quan_he_voi_chu_ho, thuong_tru_truoc_day)
      VALUES ?
      `,
      [values]
    );

    await conn.commit();
    return { success: true, id_dk };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

module.exports = {
  getHouseByHouseholderCCCD,
  registerExistingHouse,
  registerNewHouse,
};

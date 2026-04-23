import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.IP_PUBLIC_MYSQL,
  user: process.env.USER_MYSQL,
  password: process.env.PASSWORD_MYSQL,
  database: process.env.DB_MYSQL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
export async function fetchProductsFromExternal(searchTerm?: string) {
  try {
    let query = 'SELECT * FROM tabel_barang WHERE kategori LIKE "%Penjualan%"';
    const params: any[] = [];

    if (searchTerm) {
      query += ' AND (part LIKE ? OR nama_barang LIKE ?)';
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    query += ' LIMIT 50';

    const [rows]: any = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error('MySQL Connection Error:', error);
    return [];
  }
}

export async function fetchSetNameById(id: string | number) {
  try {
    const [rows]: any = await pool.query('SELECT namaset FROM tabel_set WHERE id = ?', [id]);
    if (rows.length > 0) {
      return rows[0].namaset; // Returning the name from namaset column in tabel_set
    }
    return null;
  } catch (error) {
    console.error('MySQL Fetch Set Error:', error);
    return null;
  }
}

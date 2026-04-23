"use server"

import pool from "@/lib/mysql"

export async function testMySqlConnection() {
  try {
    const connection = await pool.getConnection()
    connection.release()
    return { success: true, message: "Connected successfully to MySQL server!" }
  } catch (error: any) {
    console.error("Test Connection Error:", error)
    return { success: false, message: error.message || "Failed to connect to MySQL" }
  }
}

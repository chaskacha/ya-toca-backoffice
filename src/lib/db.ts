import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

async function initializePool() {

  const pool = new Pool({
    user: 'doadmin',
    password: 'AVNS__ssV8oPQHqrByI_-sTu',
    host: 'db-usaid-do-user-17996448-0.e.db.ondigitalocean.com',
    port: Number(25060),
    database: 'yatocadb2',
    ssl: { rejectUnauthorized: false }, // Habilitar SSL para conexiones seguras
    max: 5, // Número máximo de conexiones en el pool
  });
  return pool;
}

// Variable para almacenar el pool de conexiones
let pool: typeof Pool.prototype;

// Función para obtener el pool de conexiones, inicializándolo si es necesario
async function getPool() {
  if (!pool) {
    pool = await initializePool();
  }
  return pool;
}

export async function query(text: string, params: any[] = []) {
  const clientPool = await getPool();
  const client = await clientPool.connect();

  try {
    // console.log('Ejecutando consulta:', text);
    // console.log('Con parámetros:', params);

    // Convertir y limpiar los parámetros según su tipo
    const sanitizedParams = params.map((param) => {
      if (typeof param === 'string') {
        return param.trim(); // Limpiar espacios para strings
      }
      return param; // Dejar otros tipos sin modificar
    });
    const res = await client.query(text, sanitizedParams);

    return res;
  } catch (error) {
    console.error('Error ejecutando la consulta:', error);
    throw error; // Propagar el error para que sea manejado más arriba
  } finally {
    client.release();
  }
}
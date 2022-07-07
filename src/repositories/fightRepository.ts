import connection from "./../config/database.js";

async function getFighters() {
  const query = {
    text: `SELECT 
            username,
            wins,
            losses,
            draws
           FROM 
            fighters 
           ORDER BY 
            wins DESC, draws DESC;`,
  };

  const result = await connection.query(query);

  return result.rows;
}

async function getFighter(username: string) {
  const query = {
    text: `SELECT 
            * 
           FROM 
            fighters 
           WHERE 
            username = $1;`,
    values: [username],
  };

  const result = await connection.query(query);

  return result.rows[0];
}

async function addFighter(
  username: string,
  wins: number = 0,
  draws: number = 0,
  losses: number = 0,
) {
  const query = {
    text: `INSERT INTO 
            fighters (username, wins, draws, losses)
           VALUES ($1, $2, $3, $4);`,
    values: [username, wins, draws, losses],
  };

  await connection.query(query);
}

async function updateFighter(
  username: string,
  wins: number,
  draws: number,
  losses: number,
) {
  const query = {
    text: `UPDATE 
            fighters 
           SET 
            wins = $2, 
            draws = $3,
            losses = $4
           WHERE 
            username = $1;`,
    values: [username, wins, draws, losses],
  };

  await connection.query(query);
}

const fightRepository = {
  getFighters,
  getFighter,
  addFighter,
  updateFighter,
};

export default fightRepository;

export const acceptSessionSelectQuery = `SELECT * FROM sessions WHERE sessionid=$1`;
export const updateSessionStatusQuery= 'UPDATE sessions SET status=$1 WHERE mentorid=$2 AND sessionid=$3';
export const changeUserToMentorSelectQuery = `SELECT * FROM users WHERE id=$1`;
export const updateMentorStatusQuery = 'UPDATE users SET mentor=$1 WHERE id=$2';

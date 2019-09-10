export const admin=false;
export const mentor=false;
export const selectQuery = `SELECT * FROM users WHERE email = $1`; 
export const createAccountQuery = 'INSERT INTO users(firstname, lastname,email,password,address,bio,occupation,expertise,admin, mentor) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *';

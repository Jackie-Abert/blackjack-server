CREATE TABLE game_table (
    id SERIAL PRIMARY KEY,
    bank INTEGER NOT NULL,
    wins INTEGER,
    losses INTEGER,
    moneywon INTEGER,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL
)
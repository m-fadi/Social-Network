

DROP TABLE IF EXISTS user_profiles;

DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS friensships;
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL CHECK(firstname!=''),
    lastname VARCHAR(255) NOT NULL CHECK(lastname!=''),
    email VARCHAR(255) NOT NULL UNIQUE CHECK(email!=''),
    password VARCHAR(255) NOT NULL CHECK(password!=''),
    image_urls VARCHAR ,
    bio VARCHAR ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE reset_codes (
    id SERIAL PRIMARY KEY ,
    reset_code text NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE CHECK(email!=''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
);

CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    recipient_id INTEGER NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    otherId INTEGER REFERENCES users(id),
    messages VARCHAR,
    isPrivate BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
);











--(rafce) template for new components.

--  psql -d petition -
-- sudo su postgres;
-- TRUNCATE users_profiles, users,signatures RESTART IDENTITY;
-- delete  from users;
-- validater.validate(email validation)
-- sudo service postgresql start;

--- git push -u petition fadi  






-- Bugs//
--  delete user => either own route or fix isse in search
-- !!!!!!!!!!!!!!!ASK : call searchUserData inside useEffect in the friendStatusComponent also see if the function in deffined correctly





-- 
--  ask what is the catch error effect, how to send it back to user? and what diffrent with throw 
--add back , forward browser(hisory)
-- -ask about json Yair
-- 

--frendStatus is reseted after refresh ??????

-- LARN ABOUT:
-- Xsios 
-- useReducer


----------------------------------------------------------------------------------------------------------------------------------------

--add back , forward browser(hisory)
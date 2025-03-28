import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import fs from "fs";
import dotenv from "dotenv";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
const saltRounds = 10;
const secret = process.env.JWT_SECRET;
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync("./ca.pem").toString(),
      },
});
db.connect();


app.use(cors({credentials:true, origin:"https://blog-app-ol9y.onrender.com"}));
app.use(express.json());
app.use(cookieParser());


const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Get token from HTTP-only cookie
    console.log(token);

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Forbidden: Invalid token" });
        }
        req.user = decoded; // Store user data (including user_id) in request
        next();
    });
};

app.get("/api/cloudinary-signature", generateUploadSignature);

//Create a new user
app.post("/register", async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    try {
        const checkEmail = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (checkEmail.rows.length > 0) {
            return res.status(400).json({error: "Email already exists. Try Logging in"});
        } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.log("Error hashing password: ", err);
                    return res.status(500).json({ error: "Something went wrong. Please try again!"})
                } else {
                    const result = await db.query(
                        "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *", 
                        [firstName, lastName, email, hash]
                    );
                    res.status(201).json(result.rows[0]);
                }
            })
        }     
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }   
});

//Login
app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length > 0) {
            const storedHashPassword = user.rows[0].password;
            bcrypt.compare(password, storedHashPassword, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    if (result) {
                        jwt.sign({email: user.rows[0].email, id:user.rows[0].id}, secret, {}, (err, token) => {
                            if (err) throw err;
                            res.cookie("token", token, {
                                httpOnly: true,
                                secure: true,   // Ensures cookie is only sent over HTTPS
                                sameSite: "None" // Allows cross-site requests
                            }).json({email: user.rows[0].email, id:user.rows[0].id});
                        }); 
                        console.log("Logged in");
                    } else {
                        return res.status(400).json({error: "Wrong password or email!"});
                    }
                }
            });    
        } else {
            return res.status(400).json({error: "Wrong password or email!"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

app.get("/profile", (req, res) => {
    const {token} = req.cookies;

    if (!token) {
        return res.json(null); //Prevents send old user data
    }
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            return res.json(null);
        };
        res.json(info);
    });
})

app.post("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: new Date(0) // Expire the cookie immediately
    }).json("ok");
});

app.post("/post", verifyToken, async (req, res) => {
    const {title, category, content, imgUrl} = req.body;
    const user_id = req.user.id;
    
    try {
        const result = await db.query(
            "INSERT INTO posts (image, category, title, content, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [imgUrl, category, title, content, user_id]);
            res.json({ message: "Post created!", post: result.rows[0] });
    } catch (error) {
        console.error("Error saving post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.put("/post/:id", verifyToken, async (req, res) => {  
    const {id} = req.params;
    const {title, category, content, imgUrl} = req.body;
    const user_id = req.user.id;

    try {
       const checkPost = await db.query("SELECT user_id, image FROM posts WHERE id = $1", [id]);
       
       if (checkPost.rows.length === 0) {
        return res.sendStatus(404).json({error : "Post not found!"});
       }

       if (checkPost.rows[0].user_id !== user_id) {
        return res.status(403).json({ error: "Unauthorized: You can only edit your own posts" });
       }

       let imageToUse = checkPost.rows[0].image; //Default to existing imag

        // ✅ Only update image if a new file is uploaded
        if (req.file) {
         imageToUse = imgUrl;      
        }

       const updatedPost = await db.query(`
            UPDATE posts 
            SET title = $1, category = $2, content = $3, image = $4
            WHERE id = $5
            RETURNING *
       `, [title, category, content, imageToUse, id]);

       res.json({ message: "Post updated successfully!", post: updatedPost.rows[0] });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
});

app.get("/post", async (req, res) => {
    const result = await db.query(
        `SELECT posts.id, posts.image, posts.category, posts.title, posts.content, 
                posts.created_at, users.first_name, users.last_name 
         FROM posts 
         INNER JOIN users ON posts.user_id = users.id 
         ORDER BY posts.created_at DESC 
         LIMIT 20`
    );
    res.json(result.rows);
});


app.get("/post/:id", async (req, res) => {
    const {id} = req.params;
    const result = await db.query(
        `SELECT posts.id, posts.image, posts.category, posts.title, posts.content, 
                posts.created_at, posts.user_id, users.first_name, users.last_name 
         FROM posts 
         JOIN users ON posts.user_id = users.id 
         WHERE posts.id = $1`,  // ✅ Ensures only one post is returned
         [id]
    );
    res.json(result.rows[0]);
});

app.delete("/post/:id", async (req, res) => {
    const {id} = req.params;
    const deletedPost = db.query(`
        DELETE FROM posts
        WHERE id = $1;
    `, [id]);
    res.json({message: "Post deleted successfully"})
});

app.set("trust proxy", 1);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

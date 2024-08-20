import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


const userAuth = asyncHandler(async (req, res) => {
    const redirectUri = `http://localhost:8002/api/v1/users/oauth-callback`; // Backend callback endpoint
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    res.redirect(githubAuthUrl); // Redirect user to GitHub for authorization
});

const getAccessToken = asyncHandler(async (req, res) => {
    const { code } = req.query;

    const body = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
    };

    const opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
        },
        body: JSON.stringify(body),
    };

    try {
        const response = await fetch('https://github.com/login/oauth/access_token', opts);
        const data = await response.json();

        if (response.ok) {
            const token = data.access_token;
            console.log(data);
            res.redirect(`http://localhost:3001/?token=${token}`); // Redirect back to frontend with the token
        } else {
            throw new ApiError(500, data.error_description || "Authentication failed");
        }
    } catch (err) {
        throw new ApiError(500, "An error occurred while authenticating");
    }
});

export { userAuth, getAccessToken };

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

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
            const createUser = await fetch(`http://localhost:8002/api/v1/users/createUser/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                },
            });
            if (!createUser.ok) {
                console.log("idhar aaya")
                throw new ApiError(500, "Some error while creating user.")
            }
            res.redirect(`http://localhost:3000/vercel/?token=${token}`); // Redirect back to frontend with the token
        } else {
            throw new ApiError(500, data.error_description || "Authentication failed");
        }
    } catch (err) {
        throw new ApiError(500, "An error occurred while authenticating");
    }
});

const createUserProfile = asyncHandler(async (req, res) => {

    const { token } = req.params;
    console.log("api call hui")
    if (!token) {
        throw new ApiError(500, "Token not found");
    }

    const existedUser = await User.findOne({ accessToken: token });
    if (existedUser) {
        throw new ApiError(400, "User already exits.");
    }

    console.log(token, "token")
    const opts = {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28',
        },
    }
    const response = await fetch('https://api.github.com/user', opts);

    const data = await response.json();
    if (!response) {
        throw new ApiError(500, "An error occurred while fetching user profile");
    }
    const user = new User({
        name: data.name || "",
        username: data.login || "",
        avatar: data.avatar_url || "",
        githubProfileLink: data.url || "",
        reposUrl: data.repos_url || "",
        location: data.location || "",
        accessToken: token,
    })

    await user.save();

    console.log("object ban gya")

    if (!user) {
        throw new ApiError(500, "An error occurred while creating user profile");
    }

    res.
        status(200)
        .json(new ApiResponse(200, { user }, "User profile created successfully."))

    console.log(data, "user info");
})

const getUserProfile = asyncHandler(async (req, res) => {
    const { token } = req.params;

    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await User.findOne({ accessToken: token });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, { user }, "User profile fetched successfully"));
})

export { userAuth, getAccessToken, getUserProfile, createUserProfile };

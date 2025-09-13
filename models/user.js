const { createHmac,randomBytes} = require('node:crypto');
const {Schema, model} = require("mongoose");
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt:{
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: "/images/default.png",
    },
    role:{
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
},{timestamps: true});

// this function runs before saving the password to make a password secured by hashing.
userSchema.pre("save", function(next){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString(); // we are creating a random string for user password
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex"); // createHac is used to hash my password

    this.salt = salt;
    this.password = hashedPassword; // this is the secured password.

    next();

});

// this function is used to match the user password to its hashed password for signin purpose.

userSchema.static("matchPasswordAndGenerateToken", async function(email, password){
    const user = await this.findOne({email});

    if(!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex");

    // return hashedPassword === userProvidedHash;
    if(hashedPassword !== userProvidedHash) throw new Error("Password not matched");

    const token = createTokenForUser(user);
    return token;
});

const User = model("user", userSchema);

module.exports = User;

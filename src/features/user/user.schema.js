import mongoose from "mongoose";

const userType = ["admin", "seller", "customer"];

/**
// Test cases
"Aa1@abc" // ✅ true (Valid)
"A1@xyz"  // ✅ true (Valid)
"abc123"  // ❌ false (No uppercase, no special character)
"ABC123@" // ❌ false (No lowercase)
"a1@B"    // ❌ false (Less than 6 characters)
"Aa1@abcdefghij"// ❌ false (More than 12 characters)
"Aa1+xyz" // ❌ false (Invalid special character `+`)

 */
export const UserScema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLenght: [25, "Name can't be greater than 25 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please enter valid email"],
  },
  password: {
    type: String,
    required: true,
    minLenght: [6, "Password minimum 6 characters"],
    // custom validation
    validate: {
      validator: function (v) {
        return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$&*])[A-Za-z\d@#$&*]{6,12}$/.test(
          v
        );
      },
      message: (props) =>
        `${props.value} is not a valid password. Password must contain 6 to 12 character, at least one uppercase letter, one lowercase letter, one number, one special character @#$&*.`,
    },
  },
  type: { type: String, enum: userType, required: true },
});
// export default mongoose.model("User", UserScema);

const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { AuthenticationError } = require("apollo-server-express");

const { ApolloError } = require("apollo-server");

const { User } = require("../../database/models");

module.exports = {
  Mutation: {
    async register(root, args, context) {
      const { name, email, password } = args.input;
      console.log(name, email, password);
      const user = await User.findOne({ where: { email: email.trim() } });
      if (user) {
        // throw new UserInputError("Email Id Already Exists");
        return { message: "Email Already Exists", status: false };
      }
      const hash = await argon2.hash(password.trim());
      let result = await User.create({
        name: name.trim(),
        email: email.trim(),
        password: hash,
      });
      if (!result) {
        return { message: "Not able to create User", status: false };
      }
      return { message: "User Created", status: true };
    },

    async login(root, { input }, context) {
      const { email, password } = input;
      const user = await User.findOne({ where: { email: email.trim() } });
      if (user && argon2.verify(password.trim(), user.password)) {
        const token = jwt.sign({ id: user.id }, "mySecret");
        return { ...user.toJSON(), token };
      }
      throw new AuthenticationError("Invalid credentials");
    },
  },
};

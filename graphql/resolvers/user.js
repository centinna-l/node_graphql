const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { AuthenticationError } = require("apollo-server-express");

const { ApolloError } = require("apollo-server");

const { User } = require("../../database/models");

module.exports = {
  Mutation: {
    register: async (root, args, context) => {
      const { name, email, password } = args.input;
      console.log(name, email, password);
      const user = await User.findOne({ where: { email: email.trim() } });
      if (user) {
        // throw new UserInputError("Email Id Already Exists");
        throw new ApolloError("Email Id already exists");
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

    login: async (root, { input }, context) => {
      const { email, password } = input;
      const user = await User.findOne({ where: { email: email.trim() } });
      if (!user) {
        throw new AuthenticationError("Email Id Doesnt exist in our records");
      }
      if (user && argon2.verify(password.trim(), user.password)) {
        const token = jwt.sign({ id: user.id }, "mySecret");
        return { ...user.toJSON(), token };
      }
      throw new AuthenticationError("Invalid credentials");
    },
  },
};

/*
 * @Author: CathyLee
 * @Date: 2022-11-10 23:38:10
 * @LastEditors: CathyLee
 * @LastEditTime: 2022-11-10 23:50:03
 * @Description:
 */
module.exports = {
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },

  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],

  rules: {
    // override/add rules settings here, such as:
  },
};

const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const app = require("../../index");// Importa tu aplicación de Express

Given('I am a new user with valid registration details', function () {
  this.newUser = {
    firstname: 'Juan',
    lastname: 'Doe',
    email: 'juan.doe4@example.com',
    current_password: 'password123',
    role: 'user'
  };
});

When('I send a POST request to {string}', async function (endpoint) {
  this.response = await request(app)
    .post(endpoint)
    .send(this.newUser)
    .set('Accept', 'application/json');
});

Then('I should receive a {int} status code', function (statusCode) {
  assert.equal(this.response.statusCode, statusCode);
});

Then('I should see the message {string}', function (expectedMessage) {
  assert.equal(this.response.body.message, expectedMessage);
});
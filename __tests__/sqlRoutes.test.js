const app = require('../server/server')
const request = require('supertest')(app);
const expect = require('chai').expect;
const chai = require('chai');
const jasmine = require('jasmine')
// const assert = require('assert');
const express = require('express');
const User = require('../server/models/userModels')

describe('testing sql routes', () => {
  it('we are reaching /sql endpoint', async () => {
    const response = await request 
      .get('/sql')
    expect(response.text).to.eql("your are reaching sql endpoint");
  })
})
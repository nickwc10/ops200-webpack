/* global define, it, describe, beforeEach, afterEach, document */
const express = require('express');
const path = require('path');
const { chromium } = require('playwright');
const expect = require('chai').expect;
const axios = require('axios');

let browser, page;

const app = express();
app.use(express.static(path.join(__dirname, '/../public')));
app.use(express.static(path.join(__dirname, '/../dist')));

app.listen(8888);

const url = 'http://localhost:8888';


describe('webpack webpage', function () {
  this.timeout(15000);
  beforeEach(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterEach(async () => {
    await browser.close();
  });

  it('should load with status 200', () => axios.get(url)
    .then(response => expect(response.status === 200)));

  it('should render a div with react', async () => {
    await page.goto(url);
    await page.waitForSelector('#root div');
    const runningReact = await page.evaluate(() => {
      const selector = '[data-reactroot], [data-reactid]';
      return !!document.querySelector(selector);
    });
    expect(runningReact).to.equal(true);
  });
});

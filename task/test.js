const expect = require('chai').expect;
let chai = require("chai");
let chaiHttp = require("chai-http");
const puppeteer = require('puppeteer');
let app = require("../server");
const request = require('supertest');
const mongoose = require("mongoose");
chai.use(chaiHttp);
chai.should();
chai.use(require('chai-things'));
var geodist = require('geodist')
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const randomLocation = require('random-location')
const User = require("./../models/user.model");
const Group = require("./../models/group.model");



var groupsdata

const host = "http://localhost:3000";
let page;

// the test suite
describe('My test suite', async function () {

  // open a new browser tab and set the page variable to point at it
  before (async function () {
    global.expect = expect;
    global.browser = await puppeteer.launch( { headless: false } );
    page = await browser.newPage();
    page.setViewport({width: 1187, height: 1000});
  });

  // close the browser when the tests are finished
  after (async function () {
    await page.close();
    await browser.close();

  });


  it("It should log in as John Doe", async () =>{
    await page.goto("http://localhost:3000/signin")
    await page.waitForSelector("#email", {visible: true, timeout: 3000 });
    await page.type('#email', "johndoe@gmail.com", { delay: 100 });
    await page.type('#password', "mmmmmm", { delay: 100 });
    await page.click('button#submit')
    await page.waitForNavigation()
    await page.waitForSelector('div.yourgroups h4')
    expect(await page.$eval('div.yourgroups h4',el => el.innerText)).to.eql("You haven't joined any groups yet, click on the group link below. You can only join a maximum of three bottom level groups. If you leave one group, your votes are still recorded but not counted. If you choose to rejoin, they will count again.");

  })

  it("It should join John Doe in four groups", async () =>{
    await page.goto("http://localhost:3000/group/620b74721d131b00003f5c5d")
    await page.waitForSelector('button.joinbutton')
    await page.click('button.joinbutton')
    await page.goto("http://localhost:3000/group/620b74641d131b00003f5c5c")
    await page.waitForSelector('button.joinbutton')
    await page.click('button.joinbutton')
    await page.goto("http://localhost:3000/group/620b742a1d131b00003f5c5b")
    await page.waitForSelector('button.joinbutton')
    await page.click('button.joinbutton')
    await page.goto("http://localhost:3000/group/620aeb586f6fbb00000242b9")
    await page.waitForSelector('button.joinbutton')
    await page.click('button.joinbutton')
    await page.waitForSelector("p.toomanygroupserror")
    expect(await page.$eval('p.toomanygroupserror',el => el.innerText)).to.eql(`You have already joined the maximum number of level zero groups. You cannot have more than three, you must leave another group before you can join this one. To leave a group, visit it's page and press the leave group button near the top.`);
  })

  it("It should create an event in two of John Doe's groups approve and then disapprove of them, then delete", async () =>{
    await page.goto("http://localhost:3000/group/620b74721d131b00003f5c5d")
    await page.waitForSelector('div.events')
    await page.click('div.events')
    await page.waitForSelector('button.formbutton')
    await page.click('button.formbutton')
    await page.type('input#titleValue','test',{ delay: 100 })
    await page.type('input#descriptionValue','test event description',{ delay: 100 })
    await page.type('input#locationValue','Petersham Sydney',{ delay: 100 })
    await page.click('button.formsubmitbutton')
    await page.waitForSelector('button#test')
    await page.click('button#test')
    await page.waitFor('3000')
    await page.click('button#test')
    await page.waitFor('3000')
    await page.click('button.deletebutton#test')
    await page.goto("http://localhost:3000/group/620b742a1d131b00003f5c5b")
    await page.waitForSelector('div.events')
    await page.click('div.events')
    await page.waitForSelector('button.formbutton')
    await page.click('button.formbutton')
    await page.type('input#titleValue','test event',{ delay: 100 })
    await page.type('input#descriptionValue','test event description',{ delay: 100 })
    await page.type('input#locationValue','Petersham Sydney',{ delay: 100 })
    await page.click('button.formsubmitbutton')
    await page.waitForSelector('button#test')
    await page.click('button#test')
    await page.waitFor('3000')
    await page.click('button#test')
    await page.waitFor('3000')
    await page.click('button.deletebutton#test')

  })


  it("It should create a rule in all of John Doe's groups", async () =>{
    await page.goto("http://localhost:3000/group/620b74721d131b00003f5c5d")
    await page.waitForSelector('div.rules')
    await page.click('div.rules')
    await page.waitForSelector('button.formbutton')
    await page.click('button.formbutton')
    await page.goto("http://localhost:3000/group/620b74641d131b00003f5c5c")
    await page.waitForSelector('div.rules')
    await page.click('div.rules')
    await page.waitForSelector('button.formbutton')
    await page.click('button.formbutton')
    await page.goto("http://localhost:3000/group/620b742a1d131b00003f5c5b")
    await page.waitForSelector('div.rules')
    await page.click('div.rules')
    await page.waitForSelector('button.formbutton')
    await page.click('button.formbutton')
  })

  it("It should withdraw approval of the rule and then give approval then check messages", async () =>{

  })

  it("It should create a post in all of John Doe's groups", async () =>{
    await page.goto("http://localhost:3000/group/620b74721d131b00003f5c5d")
    await page.waitForSelector('div.news')
    await page.click('div.news')
    await page.waitForSelector('button.formbutton')
    await page.click('button.formbutton')
    await page.goto("http://localhost:3000/group/620b74641d131b00003f5c5c")
    await page.waitForSelector('div.news')
    await page.click('div.news')
    await page.waitForSelector('button.formbutton')
    await page.click('button.formbutton')
    await page.goto("http://localhost:3000/group/620b742a1d131b00003f5c5b")
    await page.waitForSelector('div.news')
    await page.click('div.news')
    await page.waitForSelector('button.formbutton')
    await page.click('button.formbutton')
  })

  it("create a poll and three suggestions in all of John Doe's groups", async () =>{
    await page.goto("http://localhost:3000/group/620b74721d131b00003f5c5d")
    await page.waitForSelector('div.polls')
    await page.click('div.polls')
    await page.goto("http://localhost:3000/group/620b74641d131b00003f5c5c")
    await page.waitForSelector('div.polls')
    await page.click('div.polls')
    await page.goto("http://localhost:3000/group/620b742a1d131b00003f5c5b")
    await page.waitForSelector('div.polls')
    await page.click('div.polls')
  })

  it("should withdraw approval of all suggestions then approve again", async () =>{

  })

  it("visit a new group, check there are no message notifications, then return to original group", async () =>{

  })


  it("It should create a restriction poll in all three groups for one day all kinds of restrictions", async () =>{
    await page.goto("http://localhost:3000/group/620b74721d131b00003f5c5d")
    await page.waitForSelector('div.jury')
    await page.click('div.jury')
    await page.goto("http://localhost:3000/group/620b74641d131b00003f5c5c")
    await page.waitForSelector('div.jury')
    await page.click('div.jury')
    await page.goto("http://localhost:3000/group/620b742a1d131b00003f5c5b")
    await page.waitForSelector('div.jury')
    await page.click('div.jury')
  })
  it("It should withdraw approval of the restrictions then approve again", async () =>{

  })

  it("It should check to see if all the previous restrictions are approved and work", async () =>{

  })



  it("It should visit the single user page and change settings so as not to receive email notifications for all things", async () =>{

  })

  it("Visit one of John Doe's groups, create all kinds of things, withdraw vote and give vote to all of them", async () =>{

  })

  it("visit one of John Doe's groups' leader page, vote for John Doe, check that he becomes leader", async () =>{

  })

  it("create a new account, Jack Smith, log in, visit the same group as above, join, create two of all kinds of things, then press delete button on all of them",
   async () =>{

  })
  it("Log in as John Doe, visit the group above and use leader privileges to delete his stuff", async () =>{

  })

  it("As John Doe, immediately impose restrictions on Jack Smith", async () =>{

  })

  it("As John Doe, visit Jack Smith's userpage and delete the restriction you created or chck they exist", async () =>{

  })

  it("visit the higher level group and again go to leader page and vote for John Doe", async () =>{

  })

  it("On the same level 1 group, create all kinds of things, withdraw and give vote", async () =>{

  })

  it("visit all the groups below that group and check to see if they have received the things that have been passed down", async () =>{

  })

  it("visit level two group, Australia, repeat the above steps", async () =>{

  })

  it("visit a new group, check there are no messages", async () =>{

  })

  it(`visit a new group, write a message, visit a different group,
  write a different message, return to the original group and check message is as it should be`, async () =>{

  })

  it(`delete John Doe, Jack Smith and everything they created, leave his groups`, async () =>{


    await page.goto("http://localhost:3000/group/620b74721d131b00003f5c5d")
    await page.waitForSelector('button.leavebutton')
    await page.click('button.leavebutton')
    await page.goto("http://localhost:3000/group/620b74641d131b00003f5c5c")
    await page.waitForSelector('button.leavebutton')
    await page.click('button.leavebutton')
    await page.goto("http://localhost:3000/group/620b742a1d131b00003f5c5b")
    await page.waitForSelector('button.leavebutton')
    await page.click('button.leavebutton')
    await page.goto("http://localhost:3000")
    await page.waitForSelector('div.yourgroups h4')
    expect(await page.$eval('div.yourgroups h4',el => el.innerText)).to.eql(`You haven't joined any groups yet, click on the group link below. You can only join a maximum of three bottom level groups. If you leave one group, your votes are still recorded but not counted. If you choose to rejoin, they will count again.`);
  })
  })

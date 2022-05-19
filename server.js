const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors  = require('cors')
const path = require('path')
const axios = require('axios');
const compress = require( 'compression')
const helmet = require( 'helmet')
const userRoutes = require( './routes/user.routes')
const leadersRoutes = require( './routes/leaders.routes')
const authRoutes = require( './routes/auth.routes')
const postRoutes = require( './routes/post.routes')
const groupsRoutes = require( './routes/groups.routes')
const rulesRoutes = require( './routes/rules.routes')
const eventsRoutes = require( './routes/events.routes')
const pollRoutes = require( './routes/polls.routes')
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');
const multer=require('multer')
const { Chat } = require("./models/Chat");
const { auth } = require("./middleware/auth");
const cookieParser = require("cookie-parser");
const fs = require("fs");
var cron = require('node-cron');
const User = require("./models/user.model");
const Group = require("./models/group.model");
const Rule = require("./models/rule.model");
const Event = require("./models/event.model");
const Restriction = require("./models/restriction.model");
const Suggestion = require("./models/suggestion.model");
const Post = require("./models/post.model");
const Poll = require("./models/poll.model");
const RestrictionPoll = require("./models/restrictionpoll.model");
const Comment = require("./models/comment.model");
const KmeansLib = require('kmeans-same-size');
const favicon = require("serve-favicon")
var kmeans = new KmeansLib();
var geocluster = require("geocluster");
var geodist = require('geodist')
const nodemailer = require('nodemailer');
// let secure = require('ssl-express-www');

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
  secure: true
});

//comment out before building for production
const PORT = process.env.PORT||5000

const app = express();
const server = require("http").createServer(app);
let origin


console.log("origin",origin)
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000"||"https://democratic-social-network.herokuapp.com",
    methods: ["GET", "POST"]
  }
});

app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
// app.use(secure);
app.use(cookieParser());
app.use(favicon(path.join(__dirname,"client", "public","favicon.ico")))
if(process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*")
  res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
  next();
})


const connect = mongoose
  .connect(process.env.DATABASE, { useNewUrlParser: true })
  .then(() => console.log("connected to mongodb"))
  .catch(err => console.error(err));


// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', postRoutes)
app.use('/groups', groupsRoutes)
app.use('/leaders', leadersRoutes)
app.use('/rules', rulesRoutes)
app.use('/events', eventsRoutes)
app.use('/posts',postRoutes)
app.use('/polls', pollRoutes)



app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));


// const MILLISECONDS_IN_A_MONTH=2629800000
// const MILLISECONDS_IN_THREE_MONTHS=7889400000
// const MILLISECONDS_IN_A_DAY=86400000
// const MILLISECONDS_IN_NINE_MONTHS=23668200000
let grouptitles
cron.schedule('0 0 0 * * *', () => {
(async function(){
 grouptitles=await Group.find({cool:true}).exec()
 grouptitles=grouptitles.map(item=>item.title)
})()})
//
// cron.schedule('0 0 0 * * *', () => {
//
//   (async function(){
//     let d = new Date();
//     let n = d.getTime();
//     let users=await User.find().exec()
//     let events=await Event.find().exec()
//     let rules=await Event.find().exec()
//     let restrictions=await Restriction.find().exec()
//     let posts=await Post.find().exec()
//     let polls=await Poll.find().exec()
//     let suggestions=await Suggestion.find().exec()
//     let restrictionpolls=await RestrictionPoll.find().exec()
//     let comments=await Comment.find().exec()
//     let groups=await Group.find({cool:true})
//           .populate({
//       path: 'groupsbelow',
//       populate: {
//         path: 'groupsbelow',
//       }
//     }).exec()
//
//
//     for (let gr of groups){
//
//       let elapsed=n-gr.timecreated
//       if(gr.level==0){
//         if ((gr.members.length<3)&&(elapsed>MILLISECONDS_IN_A_MONTH)&&gr.cool){
//           Group.findByIdAndDelete(gr._id).exec()
//           for (let group of groups){
//             if (group.groupsbelow.includes(gr._id)){
//               Group.findByIdAndUpdate(gr._id, {$pull : {
//                 groupsbelow:gr._id
//               }}).exec()
//             }
//           }
//           if(gr.images){
//             for (let img of gr.images){
//               cloudinary.uploader.destroy(img, function(error,result) {
//                 console.error(error)
//                 console.log(result)
//             })
//           }
//         }
//       }
//     }
//
//   for (let user of users){
//     let recentsignins=[]
//     let thresholdtodelete=[]
//     let date = new Date(user.created); // some mock date
//     let millisecondssinceusercreated = date.getTime()
//     millisecondssinceusercreated=n-millisecondssinceusercreated
//
//
//     let index=user.signins.length-1
//
//
//     let timeelapsedsincelogin=n-user.signins[`${index}`]
//
//     if(timeelapsedsincelogin>MILLISECONDS_IN_A_MONTH){
//
//       if(user.images){
//         for (let img of user.images){
//
//           cloudinary.uploader.destroy(img, function(error,result) {
//             console.error(error)
//             console.log(result)
//         })
//       }}
//
//       await User.findByIdAndDelete(user._id).exec()
//       for (let gr of groups){
//         Group.findByIdAndUpdate(gr._id, {$pull : {
//           members:user._id
//         }}).exec()
//       }
//     }
//   }
//
//
//   for (let gr of groups){
//     let allmembers=[]
//     let allleveltwomembers=[]
//     let alllevelonemembers=[]
//     if (gr.level==2){
//       allleveltwomembers.push(...gr.members)
//       if (gr.groupsbelow){
//         for (let grou of gr.groupsbelow){
//           allleveltwomembers.push(...grou.members)
//           if (grou.groupsbelow){
//             for (let gro of grou.groupsbelow){
//               allleveltwomembers.push(...gro.members)
//             }
//           }
//         }
//       }
//     }
//     if (gr.level==1){
//       alllevelonemembers.push(...gr.members)
//       if (gr.groupsbelow){
//         for (let grou of gr.groupsbelow){
//           alllevelonemembers.push(...grou.members)
//         }
//       }
//     }
//
//     alllevelonemembers=[...new Set(alllevelonemembers)]
//     allleveltwomembers=[...new Set(allleveltwomembers)]
//
//     for (let rule of rules){
//       if (rule.groupIds.includes(group._id)){
//         for (let approvee of rule.approval){
//           if (rule.level==2){
//               if (!allleveltwomembers.includes(approvee)){
//                 Rule.findByIdAndUpdate(rule._id, {$pull : {
//                   approval:approvee
//                 }}).exec()
//           }
//         }
//           if(rule.level==1){
//             if (!alllevelonemembers.includes(approvee)){
//               Rule.findByIdAndUpdate(rule._id, {$pull : {
//                 approval:approvee
//               }}).exec()
//             }
//           }
//           if(rule.level==0){
//             if (!gr.members.includes(approvee)){
//               Rule.findByIdAndUpdate(rule._id, {$pull : {
//                 approval:approvee
//               }}).exec()
//             }
//           }
//         }
//       }
//     }
//     for (let ev of events){
//       if (ev.groupIds.includes(group._id)){
//         for (let approvee of ev.approval){
//           if (ev.level==2){
//               if (!allleveltwomembers.includes(approvee)){
//                 Event.findByIdAndUpdate(ev._id, {$pull : {
//                   approval:approvee
//                 }}).exec()
//           }
//         }
//           if(ev.level==1){
//             if (!alllevelonemembers.includes(approvee)){
//               Event.findByIdAndUpdate(ev._id, {$pull : {
//                 approval:approvee
//               }}).exec()
//             }
//           }
//           if(ev.level==0){
//             if (!gr.members.includes(approvee)){
//               Event.findByIdAndUpdate(ev._id, {$pull : {
//                 approval:approvee
//               }}).exec()
//             }
//           }
//         }
//       }
//     }
//     for (let restriction of restrictionpolls){
//       if (restriction.groupIds.includes(group._id)){
//         for (let approvee of restriction.approval){
//           if (restriction.level==2){
//               if (!allleveltwomembers.includes(approvee)){
//                 RestrictionPoll.findByIdAndUpdate(restriction._id, {$pull : {
//                   approval:approvee
//                 }}).exec()
//           }
//         }
//           if(restriction.level==1){
//             if (!alllevelonemembers.includes(approvee)){
//               RestrictionPoll.findByIdAndUpdate(restriction._id, {$pull : {
//                 approval:approvee
//               }}).exec()
//             }
//           }
//           if(restriction.level==0){
//             if (!gr.members.includes(approvee)){
//               RestrictionPoll.findByIdAndUpdate(restriction._id, {$pull : {
//                 approval:approvee
//               }}).exec()
//             }
//           }
//         }
//       }
//     }
//     for (let poll of polls){
//       if (poll.groupIds.includes(group._id)){
//         for (let approvee of poll.approval){
//                     if (poll.level==2){
//                         if (!allleveltwomembers.includes(approvee)){
//                           Poll.findByIdAndUpdate(poll._id, {$pull : {
//                             approval:approvee
//                           }}).exec()
//                     }
//                   }
//                     if(poll.level==1){
//                       if (!alllevelonemembers.includes(approvee)){
//                         Poll.findByIdAndUpdate(poll._id, {$pull : {
//                           approval:approvee
//                         }}).exec()
//                       }
//                     }
//                     if(poll.level==0){
//                       if (!gr.members.includes(approvee)){
//                         Poll.findByIdAndUpdate(poll._id, {$pull : {
//                           approval:approvee
//                         }}).exec()
//                       }
//                     }
//         }
//       }
//     }
//     for (let suggest of suggestions){
//       if (suggest.groupIds.includes(group._id)){
//         for (let approvee of suggest.approval){
//           if (suggest.level==2){
//               if (!allleveltwomembers.includes(approvee)){
//                 Suggestion.findByIdAndUpdate(suggest._id, {$pull : {
//                   approval:approvee
//                 }}).exec()
//           }
//         }
//           if(suggest.level==1){
//             if (!alllevelonemembers.includes(approvee)){
//               Suggestion.findByIdAndUpdate(suggest._id, {$pull : {
//                 approval:approvee
//               }}).exec()
//             }
//           }
//           if(suggest.level==0){
//             if (!gr.members.includes(approvee)){
//               Suggestion.findByIdAndUpdate(suggest._id, {$pull : {
//                 approval:approvee
//               }}).exec()
//             }
//           }
//         }
//       }
//     }
//   }
//
// for (let item of events){
//   if (n-item.timecreated>MILLISECONDS_IN_NINE_MONTHS){
//     Event.findByIdAndDelete(item._id).exec()
//     cloudinary.v2.uploader.destroy(item.images[0],
//       function(error, result){
//         console.error(error)
//         console.log(result)
//   })
// }
// for (let item of restrictions){
//   if (n-item.timecreated>MILLISECONDS_IN_NINE_MONTHS){
//     Restriction.findByIdAndDelete(item._id).exec()
//   }
// }
// for (let item of posts){
//   if (n-item.timecreated>MILLISECONDS_IN_NINE_MONTHS){
//     Post.findByIdAndDelete(item._id).exec()
//   }
// }
//
//
// for (let item of restrictionpolls){
//   if (n-item.timecreated>MILLISECONDS_IN_NINE_MONTHS){
//     RestrictionPoll.findByIdAndDelete(item._id).exec()
//   }
// }
// for (let item of polls){
//   if (n-item.timecreated>MILLISECONDS_IN_NINE_MONTHS){
//     Poll.findByIdAndDelete(item._id).exec()
//   }
// }
// for (let item of comments){
//   if (n-item.timecreated>MILLISECONDS_IN_NINE_MONTHS){
//     Comment.findByIdAndDelete(item._id).exec()
//   }
// }
//
//
//
//
// for (let rest of restrictions){
//   let durationinmilli=rest.duration*MILLISECONDS_IN_A_DAY
//   let timesincecreation=n-rest.timecreated
//   if (timesincecreation>durationinmilli){
//     Restriction.findByIdAndDelete(rest._id)
//     .exec()
//
//     User.findByIdAndUpdate(rest.usertorestrict, {$pull : {
//     restrictions:rest._id
//     }}).exec(function(err,docs){
//       if(err){
//               console.error(err);
//           }else{
//     }
//      })
//   }
// }
// }}})()
// })


var users={}


io.on("connection", socket => {

socket.on("connect_error", (err) => {  console.log(`connect_error due to ${err.message}`);})

  socket.on("new user",function(data){
      socket.name=data
        users[`${socket.name}`]=socket.id
      let da=data
      socket.join(data)
  })


  socket.on("join group room",async function(room){
    console.log("join group room",room,"GROUP TITLES",grouptitles)
    let allrooms=io.sockets.adapter.rooms
    for (let room in allrooms){
      let myregex=/\d+/g
      if (!grouptitles.includes(room)){
          delete allrooms[`${room}`]
        }
      }

    allrooms = Object.fromEntries(allrooms);
console.log(allrooms)
    for (let ro in allrooms){
      console.log(ro)
      let name=room.userName.toLowerCase()
      let roo=ro.toLowerCase()
      if(roo.includes(name)){
        socket.leave(ro);
      }
    }
    socket.join(room.room);
  })

  socket.on("join room",async function(room){
    socket.leave(room.groupId);
    socket.join(room.room);
    let us=room.userName
    socket.join(us)
    let user = await User.findById(room.userId).populate('recentprivatemessages').exec()
    let result = user.recentprivatemessages.filter(us =>!(us.sender==room.recipientId));
    let chatids=result.map(item=>item._id)
    let usertwo = await User.findByIdAndUpdate(room.userId,{recentprivatemessages:chatids},{new:true}).exec()
    user.recentprivatemessages=result
    io.to(socket.id).emit("Joined Room", user);
  })


  socket.on("Input Chat Message To User", msg => {

    connect.then(db => {
      try {
        var d = new Date();
        var n = d.getTime();

          var chat = new Chat({ message: msg.chatMessage, sender:msg.userId, type: msg.type,recipient:msg.recipient._id,timecreated:n })

          chat.save((err, doc) => {

            if(err) return res.json({ success: false, err });

            User.findByIdAndUpdate(msg.recipient._id,{$push : {
            recentprivatemessages:doc._id
            }}).exec(function(err,docs){
              if(err){
                      console.error(err);
                  }else{

            }
             })

            Chat.find({ "_id": doc._id })
            .populate('sender')
            .exec((err, doc)=> {
              let doccopy=JSON.parse(JSON.stringify(doc[0]))
              let sender=doc[0][`sender`][`_id`]
              doccopy.sender=sender

              io.emit("Output pm", doccopy);
              return io.to(msg.room).emit("Output Chat Message", doc);
            })
          })
      } catch (error) {
        console.error(error);
      }
    })
   })


  socket.on("Input Chat Message", msg => {

    connect.then(db => {
      try {

        var d = new Date();
        var n = d.getTime();
        console.log(msg)
          var chat = new Chat({ message: msg.chatMessage, sender:msg.userId,groupId:msg.groupId, type: msg.type,timecreated:n })

          chat.save((err, doc) => {
            if(err) return res.json({ success: false, err })

            Chat.find({ "_id": doc._id })
            .populate("sender")
            .exec((err, doc)=> {
                console.log("increase unread whole group count",msg.groupTitle,io.sockets.adapter.rooms)
                io.emit("increase unread whole group count", doc);
                return io.to(msg.groupTitle).emit("Output Chat Message", doc);

            })
          })
      } catch (error) {
        console.error(error);
      }
    })
   })
})


//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads'));




if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))

    app.get('*',(req,res) => {
        res.sendFile(path.join(__dirname,'client','build','index.html'))
    })
}


module.exports = app

server.listen(PORT, () => {
console.log("listening on port ",PORT)
});
//
//
//
//
//
//
// function shuffle(array) {
//   var currentIndex = array.length,  randomIndex;
//
//   // While there remain elements to shuffle...
//   while (0 !== currentIndex) {
//
//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex--;
//
//     // And swap it with the current element.
//     [array[currentIndex], array[randomIndex]] = [
//       array[randomIndex], array[currentIndex]];
//   }
//
//   return array;
// }
//
// async function shufflemembersallgroups(){
// let groups=await Group.find().exec()
// for (let group of groups){
//  let shuffledmembers=shuffle(group.members)
//  Group.findByIdAndUpdate(group._id, {$addToSet : {
//  members:shuffledmembers
// }}).exec()
// }
// }
//
// cron.schedule('0 0 1 * *', () => {
//
//  shufflemembersallgroups()
// })
//
//
// cron.schedule('*/0.5 * * * *', () => {
//
// chooseLeaders()
// async function chooseLeaders(){
//   let users=await User.find().exec()
//   users=users.map(user=>{return {name:user.name,_id:user._id,usergroups:[]}})
//
//   let groups=await Group.find({cool:true})
//      .populate({
//       path : 'groupsbelow',
//       populate : {
//         path : 'members'
//       }
//     }).exec()
// groups=groups.map(gr=>{return {title:gr.title,groupsbelow:gr.groupsbelow,level:gr.level,
//   members:gr.members,_id:gr._id,tempmembs:[]}})
//   for (let group of groups){
// if (group.members){
//   for (let memb of group.members){
//     if (group.level==0){
//       for (let user of users){
//         console.log("user memb",group.title,user._id,memb)
//         if (String(user._id)==String(memb)){
//           let usergroupscopy=JSON.parse(JSON.stringify(user.usergroups))
//           let groupId=String(group._id)
//           console.log("groupId",groupId)
//           usergroupscopy.push(groupId)
//           user['usergroups']=usergroupscopy
//         }
//       }
//     }
//   }
// }
//
//     for (let groupbelow of group.groupsbelow){
//         let members=JSON.parse(JSON.stringify(groupbelow.members))
//         let memberids
//         let oldleaders
//         if (members){
//           memberids=members.map(item=>item._id)
//           oldleaders=group.members.filter(item=>!memberids.includes(item._id))
//           let allmembers=JSON.parse(JSON.stringify(groupbelow.members))
//           let groupidentifier=`${groupbelow.title},${groupbelow.level}`
//           for (let member of members){
//                let groupidentifier=`${groupbelow.title},${groupbelow.level}`
//                member.votes=member.votes.filter(item=>item.startsWith(groupidentifier))
//            }
//            let malemembers=[]
//            let femalemembers=[]
//            let leaders=[]
//            if(members.length>0){
//              members=members.filter(checkThreshold)
//
//              function checkThreshold(memb) {
//                return  (memb.votes.length/groupbelow.members.length)>0.5;
//              }
//               members.sort((a, b) => (a.votes.length < b.votes.length) ? 1 : -1)
//              malemembers=members.filter(memb=>memb.sex=="male")
//              femalemembers=members.filter(memb=>memb.sex=="female")
//            }
//            if(malemembers.length>0&&femalemembers.length>0){
//              if(femalemembers[0]&&malemembers[0]){
//                leaders=[femalemembers[0],malemembers[0]]
//              }
//            }
//            if(leaders){
//              leaderids=leaders.map(item=>item._id)
//              console.log("newleaders,oldleaders",groupbelow.title,leaderids,oldleaders)
//            }
//            console.log(",oldleaders",oldleaders)
//
//            for (let lead of leaders){
//              if (!oldleaders.includes(lead._id)){
//                for (let memb of allmembers){
//                    const transporter = nodemailer.createTransport({
//                      service: 'gmail',
//                      auth: {
//                        user: process.env.EMAIL,
//                        pass: process.env.PASSWORD
//                      }
//                    })
//
//                    let emails=allmembers.map(item=>item.email)
//
//                    const optionsArray=emails.map(email=>{
//                      const mailOptions = {
//                        from: process.env.EMAIL,
//                        to: memb.email,
//                        subject: 'new leader',
//                        text: `${lead.name} has been elected as a leader in the group ${groupbelow.title} at level ${groupbelow.level}`
//                      };
//                      return mailOptions
//                    })
//
//                    optionsArray.forEach(sendEmails)
//
//                    function sendEmails(item){
//                      console.log(item)
//                      transporter.sendMail(item, function(error, info){
//                        if (error) {
//                          console.error(error);
//                        } else {
//                          // console.log(info)
//                        }
//                      })
//
//                    }
//              }
//              }
//            }
//            if(leaders){
//              if(leaders.length>0){
//                leaders=leaders.map(item=>item._id)
//                if(group.level>0){
//                  group.tempmembs.push(...leaders)
//                }
//                for (let leader of leaders){
//                  for (let user of users){
//                    if (String(user._id)==String(leader)){
//                      let usergroupscopy=JSON.parse(JSON.stringify(user.usergroups))
//                      let groupId=String(group._id)
//                      usergroupscopy.push(groupId)
//                      user['usergroups']=usergroupscopy
//                    }
//                    }
//                  }
//              }
//
//            }
//          }
//         }
//         if(group.level>0){
//           console.log("group title and membs",group.title,group.tempmembs)
//           await Group.findByIdAndUpdate(group._id, {members:group.tempmembs}).exec()
//         }
//     }
//
//     for (let user of users){
//       user.usergroups=[...new Set(user.usergroups)]
//       console.log(user)
//       await User.findByIdAndUpdate(user._id, {groupstheybelongto:user.usergroups}).exec()
//     }
//   }
// })

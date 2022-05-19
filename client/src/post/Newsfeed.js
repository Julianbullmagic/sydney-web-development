import React, {useState,useRef, useEffect} from 'react'
import auth from './../auth/auth-helper'
import Comment from './Comment'
import io from "socket.io-client";
const mongoose = require("mongoose");


export default function Newsfeed (props) {
  const [viewForm, setViewForm] = useState(false);
  const [viewExplanation, setViewExplanation] = useState(false);
  const postArea = React.useRef('')
  const [posts, setPosts] = useState([]);
  const [group, setGroup] = useState(props.group);
  const [post, setPost] = useState("");
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageNum, setPageNum] = useState([]);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [comment, setComment] = useState("");
  const [preview, setPreview] = useState("");
  let server = "http://localhost:5000";
  let socket

  if(process.env.NODE_ENV=="production"){
    socket=io();
  }
  if(process.env.NODE_ENV=="development"){
    socket=io(server);
  }
  useEffect(() => {

    setGroup(props.group)
    fetch("/posts/getposts/"+props.groupId)
    .then(res => {
      return res.json();
    }).then(posts => {

      let po=posts.data
      po.reverse()
      setPosts(po)


      let currentpage=po.slice(0,10)

      setCurrentPageData(currentpage)

      let pagenum=Math.ceil(posts.data.length/10)

      let pagenums=[]
      while(pagenum>0){
        pagenums.push(pagenum)
        pagenum--
      }
      pagenums.reverse()

      setPageNum(pagenums)
    }).catch(err => {
      console.error(err);
    })
  },[props])

  useEffect(() => {

    var urlRegex = /(https?:\/\/[^ ]*)/;
    if (post.match(urlRegex)){
      var url = post.match(urlRegex)[0]
      getPreview(url)
    }


  },[post])


  function sendPostDown(posttosend,postss){

    if(!posttosend.sentdown){
      let postcopy=JSON.parse(JSON.stringify(postss))

      for (let po of postcopy){
        if (po._id==posttosend._id.toString()){
          po.sentdown=true
        }
      }
      setPosts(postcopy)
      let current=postcopy.slice((page*10-10),page*10)

      setCurrentPageData(current)

      const options = {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: ''
      }

      fetch("/posts/marksentdown/" + posttosend._id.toString(), options
    ).then(res => {
      console.log(res)
    }).catch(err => {
      console.error(err);
    })


    let lowergroupids=[]
    for (let grou of group.groupsbelow){

      if(grou.groupsbelow){
        lowergroupids.push(...grou.groupsbelow)
      }
      lowergroupids.push(grou._id)
    }

    for (let gr of lowergroupids){

      fetch("/posts/sendpostdown/" + posttosend._id.toString() +"/"+ gr, options
    ).then(res => {
      console.log(res)
    }).catch(err => {
      console.error(err);
    })
  }
}
}

function getId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11)
  ? match[2]
  : null;
}

function decidePage(e,pagenum){


  let currentpage=posts.slice((pagenum*10-10),pagenum*10)

  setPage(pagenum)
  setCurrentPageData(currentpage)
}

async function getPreview(url){
  var data = {key: '567204aab52f43be1f7bbd3573ff4875', q: url}

  if (url.includes("youtube")){
    const videoId = getId(url);
    const iframesrc = `http//www.youtube.com/embed/${videoId}`
    data = {key: '567204aab52f43be1f7bbd3573ff4875', q: iframesrc}

  }


  var prev=await fetch('https://api.linkpreview.net', {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(data),
  })
  .then(res => res.json())
  .then(response => {return response})
  .catch(err => {
    console.error(err);
  })

  setPreview(prev)
}


function handleSubmit(e){
  e.preventDefault()
  setUploading(true)
  setTimeout(() => {
    setUploading(false)
  }, 3000)
  var d = new Date();
  var n = d.getTime();
  var postId=mongoose.Types.ObjectId()

  const newPost={
    _id:postId,
    post:post,
    level:group.level,
    politicalmarketing:[],
    groupIds:[props.groupId],
    preview:preview,
    timecreated:n,
    createdby:auth.isAuthenticated().user._id
  }
 let newPostToRender=JSON.parse(JSON.stringify(newPost))
 newPostToRender.createdby=auth.isAuthenticated().user
  let chatMessage=`created a new post`
  let userId=auth.isAuthenticated().user._id
  let userName=auth.isAuthenticated().user.name
  let nowTime=n
  let type="text"
  let groupId=group._id
  let groupTitle=group.title
  console.log(groupTitle)
  socket.emit("Input Chat Message", {
    chatMessage,
    userId,
    userName,
    nowTime,
    type,
    groupId,
    groupTitle});

    let postscopy=JSON.parse(JSON.stringify(posts))
    postscopy.reverse()
    postscopy.push(newPostToRender)
    postscopy.reverse()

    sendPostNotification(newPost)


    const options={
      method: "POST",
      body: JSON.stringify(newPost),
      headers: {
        "Content-type": "application/json; charset=UTF-8"}}

        fetch("/posts/createpost/"+postId, options)
        .then(response => response.json())
        .then(json =>console.log(json))
          .catch(err => {
            console.error(err);
          })
          sendPostDown(newPost,postscopy)
        }


        function deletePost(e,id){
          let post
          let postscopy=JSON.parse(JSON.stringify(posts))
          for (let po of postscopy){
            if(po._id == id){
              post=po.post
            }
          }
          let filteredarray = postscopy.filter(item=>!(item._id == id));
          setPosts(filteredarray);
          let current=filteredarray.slice((page*10-10),page*10)

          setCurrentPageData(current)

          const options={
            method: "Delete",
            body: '',
            headers: {
              "Content-type": "application/json; charset=UTF-8"}}

              var d = new Date();
              var n = d.getTime();


              let chatMessage=`deleted a post`
              let userId=auth.isAuthenticated().user._id
              let userName=auth.isAuthenticated().user.name
              let nowTime=n
              let type="text"
              let groupId=group._id
              let groupTitle=group.title

              socket.emit("Input Chat Message", {
                chatMessage,
                userId,
                userName,
                nowTime,
                type,
                groupId,
                groupTitle});

                fetch("/posts/deletepost/"+id, options)
                .then(response => response.json())
                .then(json =>console.log(json))
                  .catch(err => {
                    console.error(err);
                  })

                  let us=JSON.parse(JSON.stringify(props.users))
                  us=us.filter(item=>item.posts)
                  let emails=us.map(item=>{return item.email})

                  let notification={
                    emails:emails,
                    subject:"Post Deleted",
                    message:`${auth.isAuthenticated().user.name} deleted the post called ${post} in the group ${group.title} at level ${group.level}`
                  }

                  const opt = {
                    method: 'post',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(notification)
                  }

                  fetch("/groups/sendemailnotification", opt
                ) .then(res => {
                  console.log(res)
                }).catch(err => {
                  console.error(err);
                })

              }

              function markAsPoliticalMarketing(e,id){
                console.log(id)
                let postscopy=JSON.parse(JSON.stringify(posts))

                for (var post of postscopy){
                  if (post._id==id){
                    if(!post.politicalmarketing.includes(auth.isAuthenticated().user._id)){
                      post.politicalmarketing.push(auth.isAuthenticated().user._id)
                    }
                    setPosts(postscopy)
                  }
                }

                let current=postscopy.slice((page*10-10),page*10)
                setCurrentPageData(current)

                const options = {
                  method: 'put',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: ''
                }

                fetch("/posts/markaspoliticalmarketing/" + id +"/"+ auth.isAuthenticated().user._id, options
              ).catch(err => {
                console.error(err);
              })
              }

              function withdrawMarkAsPoliticalMarketing(e,id){
                console.log(id)
                let postscopy=JSON.parse(JSON.stringify(posts))
                function checkPost(userid) {
                  return userid!=auth.isAuthenticated().user._id
                }
                for (let post of postscopy){
                  if (post._id==id){
                    let filteredapproval=post.politicalmarketing.filter(checkPost)
                    post.politicalmarketing=filteredapproval
                  }
                }
                setPosts(postscopy)
                let current=postscopy.slice((page*10-10),page*10)
                setCurrentPageData(current)

                const options = {
                  method: 'put',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: ''
                }

                fetch("/posts/withdrawmarkaspoliticalmarketing/" + id +"/"+ auth.isAuthenticated().user._id, options
              ).catch(err => {
                console.error(err);
              })
              }

              function sendPostNotification(item){
                let postscopy=JSON.parse(JSON.stringify(posts))
                if(!item.notificationsent){

                  for (var po of postscopy){
                    if (po._id==item._id){
                      po.notificationsent=true
                      }}
                      setPosts(postscopy)
                      let current=postscopy.slice((page*10-10),page*10)

                      setCurrentPageData(current)

                      let us=JSON.parse(JSON.stringify(props.users))
                      us=us.filter(item=>item.posts)
                      let emails=us.map(item=>{return item.email})

                      let notification={
                        emails:emails,
                        subject:"New Post",
                        message:`${auth.isAuthenticated().user.name} wrote a post called ${item.post}  in the group ${group.title} at level ${group.level}`
                      }

                      const options = {
                        method: 'post',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(notification)
                      }

                      fetch("/groups/sendemailnotification", options
                    ) .then(res => {
                      console.log(res)
                    }).catch(err => {
                      console.error(err);
                    })

                    const optionstwo = {
                      method: 'put',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: ''
                    }

                    fetch("/posts/notificationsent/"+item._id, optionstwo
                  ) .then(res => {
                    console.log(res)
                  }).catch(err => {
                    console.error(err);
                  })
                }
                setPost("")
              }



              function areYouSure(e,item){
                console.log(item)
                let postscopy=JSON.parse(JSON.stringify(posts))
                  for (let post of postscopy){
                    if (post._id==item._id){
                      post.areyousure=true
                    }}
                    let current=postscopy.slice((page*10-10),page*10)
                    setPosts(postscopy)
                    setCurrentPageData(current)
                  }

                  function areYouNotSure(e,item){
                    console.log(item)
                      let postscopy=JSON.parse(JSON.stringify(posts))
                      for (let post of postscopy){
                        if (post._id==item._id){
                          post.areyousure=false
                        }}
                        let current=postscopy.slice((page*10-10),page*10)
                        setPosts(postscopy)
                        setCurrentPageData(current)
                      }

                      function viewExpl(e){
                        e.preventDefault();
                        setViewExplanation(!viewExplanation)
                      }

              if(preview){
                console.log("preview",preview)

                if(preview.url){
                  var previewmapped=<img src={preview.url} style={{marginLeft:"10vw",textAlign:"center",maxHeight:"70vh",maxWidth:"70vw",objectFit:"contain"}}></img>
                }
              }
              console.log("posts",currentPageData)
              var postsmapped=currentPageData.map((item,i)=>{
                let prev
                if (item.preview){
                      if(item.preview.url){
                         prev=<img key={item._id} style={{position:"relative",margin:"1vw",display:"block",Zindex:"-1",Position:"fixed",marginLeft:"10vw",textAlign:"center",maxHeight:"70vh",maxWidth:"70vw",objectFit:"contain"}} src={item.preview.url}></img>
                      }
                }
                let approval=<></>
                approval=Math.round((item.politicalmarketing.length/group.members.length)*100)
                let approveenames=[]
                for (let user of group.members){
                  for (let approvee of item.politicalmarketing){
                    if (approvee==user._id){
                      approveenames.push(user.name)
                    }
                  }
                }
                if (approval>75){
                  deletePost(null,item._id)
                }
                let width=`${(item.politicalmarketing.length/group.members.length)*100}%`
                console.log("prev",prev)
                return (
                  <>
                  <div key={item._id} className="postbox">
                  <div>
                  <div className="postboxform" style={{overflowX:"hidden"}}>
                  <div style={{display:"block",margin:"1vw",textAlign:"right"}}>
                  {item.createdby&&<><h5 style={{margin:"1vw",display:"inline",textAlign:"center"}}><strong> Post by {item.createdby.name}</strong></h5>
                  {(((item.createdby._id==auth.isAuthenticated().user._id)||
                    group.groupabove.members.includes(auth.isAuthenticated().user._id))&&!item.areyousure)&&
                    <button className="ruletext deletebutton" onClick={(e)=>areYouSure(e,item)}>Delete Post?</button>}</>}
                    {item.areyousure&&<button className="ruletext deletebutton" onClick={(e)=>areYouNotSure(e,item)}>Not sure</button>}
                    {item.areyousure&&<button className="ruletext deletebutton" onClick={(e)=>deletePost(e,item._id)}>Are you sure?</button>}
                    </div>
                    <h4 style={{display:"block",margin:"1vw"}}><strong>Post: </strong>{item.post}</h4>
                    {prev&&prev}

                    </div>
                    {(item.level>group.level)&&
                    <div className="postboxform">
                    <div style={{width:"100%"}}><h5 style={{display:"inline"}}><strong>This post has been passed down by a
                    level {item.level} group.</strong> Does it encourage you to vote or not vote for a particular person?</h5>

                    {!item.politicalmarketing.includes(auth.isAuthenticated().user._id)&&<button className="ruletext" onClick={(e)=>markAsPoliticalMarketing(e,item._id)}>Is this political marketing?</button>}
                    {item.politicalmarketing.includes(auth.isAuthenticated().user._id)&&<button className="ruletext" onClick={(e)=>withdrawMarkAsPoliticalMarketing(e,item._id)}>This is not political marketing?</button>}
                    {approveenames&&approveenames.map((item,index)=>{return(<><h4 className="ruletext">{item}{(index<(approveenames.length-2))?", ":(index<(approveenames.length-1))?" and ":"."}</h4></>)})}
                    <div className="percentagecontainer"><div style={{width:width}} className="percentage"></div></div>
                    </div>
                    </div>}
                      </div>
                      <Comment id={item._id}/>
                      </div>
                      </>
                    )})
                    let inthisgroup
                    if(group.members){
                      inthisgroup=group.members.map(item=>item._id)
                      inthisgroup=inthisgroup.includes(auth.isAuthenticated().user._id)
                    }

                    return (
                      <>
                      {inthisgroup&&<>
                        <button style={{display:"block"}} onClick={(e) => setViewForm(!viewForm)}>View Write Post Form?</button>

                        <div className="form" style={{maxHeight:!viewForm?"0":"1000vw",overflow:"hidden",transition:"max-height 2s"}}>
                        <form style={{display:!viewForm?"none":"block"}}>
                        <div>
                        <label htmlFor='name'>Write Post</label>
                        {!uploading&&<><button className="formsubmitbutton" onClick={(e) => handleSubmit(e)}>New Post?</button></>}
                        {uploading&&<h4>Uploading Post...</h4>}
                        <button onClick={(e) => viewExpl(e)}>View Explanation</button>
                        </div>
                        <textarea className="posttextarea" onChange={(e) => setPost(e.target.value)} ref={postArea} id="story" rows="5" cols="33" />

                        {preview&&previewmapped}
                        <div className="leaderexpl" style={{maxHeight:!viewExplanation?"0":"2000vw",overflow:"hidden"}}>
                        {group.level>0&&<p>Posts made in higher groups are immediately passed down to all groups below them.
                          Remember that <strong>you cannot promote, advertise or endorse candidates in lower groups in any way</strong>.
                          If you think a post contains this kind of marketing, you can click the button to mark it. If a 75%
                          majority in any group agrees on this, the post is deleted. If elected candidates repeatedly
                          break this rule, it is recommended to withdraw your vote from them and give it to someone else. Groups
                          must be entirely responsible for choosing their own leaders. We want a genuine meritocracy and not an
                          oligarchy in which a small minority group pre-appproves candidates that are acceptable to themselves.
                          We want genuine democracy and not a democracy where people only get to choose between a range of
                          options decided by an oligarchy. We also don't want a system where only the very wealthy can afford
                          to run political campaigns. Actually, we shouldn't have any political marketing campaigns at all.
                          Ideally, people should be politically conscious enough to actively go and do their own research
                          about who the leaders should be, instead of passively complying with what the political propoganda suggests.
                          We want a political system grounded in the authority of knowledge, wisdom and moral integrity, instead
                          of coercive or exploitative power. We don't want people to use any kind of authority to create and
                          impose rules that reinforce or propogate their own power. That would be an abuse of authority.
                          We need leaders who will try to lead the group in a direction that is in the best interests of the group
                          and not one's who will take advantage of the society for their own benefit.

                          Posts are very useful for sharing information between groups and for higher level groups to
                          try to explain why they have created certain rules, events, polls or restrictions. The mass media
                          should be used for sharing important information and not for misleading people with propoganda. On
                          the democratic social network, any user can visit any group and see their discussions. In order to prevent
                          chaotic, disorderly conversations with too many people, you cannot directly participate in all discussions,
                          but you can at least see them. This fact, combined with immediate recall of unpopular representatives
                          means that there is a much greater motivation for elected leaders to consult, discuss
                          and explain their decisions with the people effected by them or demonstrate their own trustworthyness.

                          This is quite different from and elitist political system. In an oligarchy, the masses are excluded
                          from group decision making because the rulers believe that most people are stupid, weak, immoral and irresponsible.
                          In a genuine, socialistic democracy, authority is distributed evenly so that, while you may not be able
                          to vote on all issues, you can be involved in making choices about things that are relevant to you and
                          you have the expertise to understand. Our modern world is extremely complicated, even the biggest genuises
                          can only be experts in a tiny fraction of all knowledge the human race collective has. There will always
                          be many issues that we just don't know anything about and there is no benefit in us sharing our views.
                          </p>}
                          </div>
                        </form>

                        </div>
                        </>}

                        {pageNum.length>1&&<h4 style={{display:"inline"}}>Choose Page</h4>}
                        {(pageNum.length>1&&pageNum&&posts)&&pageNum.map((item,index)=>{
                          return (<>
                            <button style={{display:"inline",opacity:(index+1==page)?"0.5":"1"}} onClick={(e) => decidePage(e,item)}>{item}</button>
                            </>)
                          })}
                          {postsmapped}
                          <br/>

                          <div style={{marginBottom:"5vw"}}>
                          {pageNum.length>1&&<h4 style={{display:"inline"}}>Choose Page</h4>}
                          {(pageNum.length>1&&pageNum&&posts)&&pageNum.map((item,index)=>{
                            return (<>
                              <button style={{display:"inline",opacity:(index+1==page)?"0.5":"1"}} onClick={(e) => decidePage(e,item)}>{item}</button>
                              </>)
                            })}
                            </div>
                            </>
                          )
                        }

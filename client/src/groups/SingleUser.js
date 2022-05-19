import React, { useState, useEffect, useRef} from 'react'
import {Redirect, Link} from 'react-router-dom'
import ChatPage from "./../ChatPage/ChatPage"
import {Image} from 'cloudinary-react'
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import auth from './../auth/auth-helper'
import io from "socket.io-client";
import Axios from 'axios'
const mongoose = require("mongoose");




export default function SingleUser({ match }) {
  const [user, setUser] = useState({})
  const [numImages, setNumImages] = useState([0]);
  const jwt = auth.isAuthenticated()
  const [events,setEvents]=useState(false)
  const [eventsApproved,setEventsApproved]=useState(false)
  const [posts,setPosts]=useState(false)
  const [loading,setLoading]=useState(false)
  const [loadingComplete,setLoadingComplete]=useState(false)
  const [polls,setPolls]=useState(false)
  const [leaders,setLeaders]=useState(false)
  const [newMembers,setNewMembers]=useState(false)
  const [rules,setRules]=useState(false)
  const [purchases,setPurchases]=useState(false)
  const [restriction,setRestriction]=useState(false)
  const [restrictions,setRestrictions]=useState([])
  const [rulesApproved,setRulesApproved]=useState(false)
  const [restrictionsApproved,setRestrictionsApproved]=useState(false)
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    performancedescription:'',
    rates:'',
    images:'',
    error:'',
    open: false,
  })
  const selectedFile1 = useRef(null)
  const selectedFile2 = useRef(null)
  const selectedFile3 = useRef(null)
  const selectedFile4 = useRef(null)
  const selectedFile5 = useRef(null)


  useEffect(() => {
    getUser()
  }, [])

  function extraImage(e){
    e.preventDefault()
    let imagenum=numImages

    if(imagenum.length<5){
      imagenum.push(0)
    }

    setNumImages([...imagenum])
  }

  function lessImage(e){
    e.preventDefault()

    let imagenum=numImages
    if(imagenum.length>0){
      imagenum.pop()
    }

    setNumImages([...imagenum])
  }


  async function getUser(){
    await fetch(`/groups/getuser/`+match.params.userId)
    .then(response => response.json())
    .then(data=>{

      setUser(data.data)
      setEvents(data.data.events)
      setEventsApproved(data.data.eventsapproved)
      setLeaders(data.data.leaders)
      setPosts(data.data.posts)
      setPolls(data.data.polls)
      setRules(data.data.rules)
      setPurchases(data.data.purchases)
      setRestrictions(data.data.restrictions)
      setRestriction(data.data.restriction)
      setRulesApproved(data.data.rulesapproved)
      setRestrictionsApproved(data.data.restrictionsapproved)
      setNewMembers(data.data.newmembers)
    })
    .catch(err => {
      console.error(err);
    })
  }

  function deleteRestriction(e,item) {
    let newrestrictions=restrictions.filter(restriction=>!(restriction._id==item._id))
    setRestrictions(newrestrictions)

    const options={
      method: "Delete",
      body: JSON.stringify(item),
      headers: {
        "Content-type": "application/json; charset=UTF-8"}}

        fetch("/groups/deleterestriction", options)
        .then(response => response.json())
        .then(json =>console.log(json))
          .catch(err => {
            console.error(err);
          })
        }
        async function updateUser(){
          setLoading(true)
          let imageids=[]

          if(selectedFile1.current.files[0]){
            const formData = new FormData();
            formData.append('file', selectedFile1.current.files[0]);
            formData.append("upload_preset", "jvm6p9qv");
            await Axios.post("https://api.cloudinary.com/v1_1/julianbullmagic/image/upload",formData)
            .then(response => {

              imageids.push(response.data.public_id)
            })}

            if(selectedFile2.current.files[0]){const formData = new FormData();
              formData.append('file', selectedFile2.current.files[0]);
              formData.append("upload_preset", "jvm6p9qv");
              await Axios.post("https://api.cloudinary.com/v1_1/julianbullmagic/image/upload",formData)
              .then(response => {

                imageids.push(response.data.public_id)
              })}

              if(selectedFile3.current.files[0]){const formData = new FormData();
                formData.append('file', selectedFile3.current.files[0]);
                formData.append("upload_preset", "jvm6p9qv");
                await Axios.post("https://api.cloudinary.com/v1_1/julianbullmagic/image/upload",formData)
                .then(response => {

                  imageids.push(response.data.public_id)
                })}

                if(selectedFile4.current.files[0]){const formData = new FormData();
                  formData.append('file', selectedFile4.current.files[0]);
                  formData.append("upload_preset", "jvm6p9qv");
                  await Axios.post("https://api.cloudinary.com/v1_1/julianbullmagic/image/upload",formData)
                  .then(response => {

                    imageids.push(response.data.public_id)
                  })}

                  if(selectedFile5.current.files[0]){const formData = new FormData();
                    formData.append('file', selectedFile5.current.files[0]);
                    formData.append("upload_preset", "jvm6p9qv");
                    await Axios.post("https://api.cloudinary.com/v1_1/julianbullmagic/image/upload",formData)
                    .then(response => {

                      imageids.push(response.data.public_id)
                    })}

                      const newuser = {
                        _id:match.params.userId,
                        name: values.name || undefined,
                        email: values.email || undefined,
                        expertise: values.expertise || undefined,
                        rates:values.rates || undefined,
                        images:imageids,
                        password: values.password || undefined,
                        events:events,
                        eventsapproved:eventsApproved,
                        newmembers:newMembers,
                        leaders:leaders,
                        posts:posts,
                        polls:polls,
                        rules:rules,
                        restriction:restriction,
                        rulesapproved:rulesApproved,
                        restrictionsapproved:restrictionsApproved
                      }


                      setUser(newuser)

                      const options={
                        method: "PUT",
                        body: JSON.stringify(newuser),
                        headers: {
                          "Content-type": "application/json; charset=UTF-8"}}


                          await fetch("/groups/updateuser/"+match.params.userId, options)
                          .then(response => response.json()).then(json =>console.log(json))
                          .catch(err=>console.error(err))
                          setLoading(false)
                          setLoadingComplete(true)
                          setTimeout(() => {
                      setLoadingComplete(false)
                      }, 5000)
                          }


                          const handleChange = name => event => {

                            setValues({ ...values, [name]: event.target.value })
                          }

                          const clickSubmit = (e) => {
                            updateUser()
                          }
                          let d = new Date();
                          let n = d.getTime();

                          let restrictionsmapped=<></>
                          if(restrictions){
                            restrictionsmapped=restrictions.map(item=>{
                              let elapsed=n-item.timecreated
                              let dayselapsed=Math.round(elapsed/86400000)
                              let daysleft=item.duration-dayselapsed
                              return (<div className="leader" style={{textAlign:"center",margin:"0.5vw"}}><p style={{display:"inline"}}><strong>Restriction: </strong>{item.restriction} for {daysleft} days. <strong>Explanation: </strong> {item.explanation}. </p>
                              {(item.createdby==auth.isAuthenticated().user._id)&&<div style={{display:"inline"}}><p style={{display:'inline'}}>You created this restriction with your leader privileges </p>
                              <button style={{display:'inline'}} onClick={(e) => deleteRestriction(e,item)}>Delete Restriction?</button></div>}</div>)})}


                              return (
                                <>
                                {user&&(
                                  <div className="signupform"  style={{textAlign:"center"}}>
                                  <div className="innersignupform"  style={{textAlign:"center"}}>
                                  <h1 style={{textAlign:"center"}}>{user.name}</h1>
                                  {user.expertise&&<h3 style={{textAlign:"center"}}>Expertise: {user.expertise}</h3>}
                                  {user.phone&&<h3 style={{textAlign:"center"}}>Phone Number: {user.phone}</h3>}
                                  {user.email&&<h3 style={{textAlign:"center"}}>Email Address: {user.email}</h3>}
                                  {(user.images&&user.images.length>0)&&<><br/>
                                    <h3 style={{textAlign:"center"}}>Images</h3>
                                    <div style={{marginBottom:"40vw"}}>
                                    <AwesomeSlider style={{marginLeft:"5vw",width:"50vw", zIndex: 1, position:"absolute"}}>
                                    {user.images&&user.images.map(item=>{return (<div><Image style={{width:"100%"}} cloudName="julianbullmagic" publicId={item} /></div>)})}
                                    </AwesomeSlider>
                                    </div></>}
                                    {(user.restrictions&&user.restrictions.length>0)&&<><h3 style={{textAlign:"center"}}>Restrictions</h3>
                                    {restrictionsmapped}</>}
                                    </div>
                                    </div>
                                  )}


                                  {(auth.isAuthenticated()&&auth.isAuthenticated().user._id==match.params.userId)&&(
                                    <div style={{transform:"translateY(-5%)"}} className="signupform">
                                    <div  style={{position: "static"}}  className="innersignupform">
                                    <h1 style={{textAlign:"center"}}>
                                    Edit Listing
                                    </h1>
                                    <div className="signininput">
                                    <h5 style={{marginRight:"1vw"}} className="ruletext">Name </h5><input id="name" placeHolder={user.name} label="Name"value={values.name} onChange={handleChange('name')} margin="normal"/>
                                    </div>

                                    <div className="signininput">
                                    <h5 style={{marginRight:"1vw",textAlign:"left"}} className="ruletext">Email </h5><input id="email" placeHolder={user.email} type="email" label="Email"  value={values.email} onChange={handleChange('email')} margin="normal"/>
                                    </div>


                                    <div style={{margin:"1vw"}}><h5 style={{marginRight:"1vw",display:"block"}}>
                                    Try to explain your skills, knowledge, experience, qualifications. You may be elected as a leader of a group and other group members
                                    need some way of evaluating if you are a good candidate.</h5>
                                    <textarea style={{width:"95%",height:"20vh",overflowY:"auto",display:"block"}} id="expertise" placeHolder={user.expertise} label="expertise" value={values.expertise} onChange={handleChange('expertise')} margin="normal"/></div>

                                    <h4>Tick the boxes below to recieve email notifications about new suggestions. At least 10% of members must have voted for something before notifications will be sent in order to help prevent individuals from spamming everyone. </h4>
                                    <div style={{display:"flex",flexWrap:"wrap"}}>
                                    <div style={{display:"inline"}}>
                                    <input
                                    type="checkbox"
                                    checked={events}
                                    style={{transform:"translateY(40%)",display:"inline"}}
                                    onChange={e => {
                                      setEvents(e.target.checked)}}
                                      />
                                      <h5 style={{marginRight:"1vw"}}  className="ruletext"> Event Suggestions, </h5>
                                      </div>
                                      <div style={{display:"inline"}}>
                                      <input
                                      type="checkbox"
                                      checked={leaders}
                                      style={{transform:"translateY(40%)"}}
                                      onChange={e => {setLeaders(e.target.checked)}}/>
                                      <h5 style={{marginRight:"1vw"}}  className="ruletext"> New Leaders, </h5>
                                      </div>
                                      <div style={{display:"inline"}}>
                                        <input
                                        type="checkbox"
                                        checked={posts}
                                        style={{transform:"translateY(40%)"}}
                                        onChange={e => {
                                          setPosts(e.target.checked)}}
                                          />
                                          <h5 style={{marginRight:"1vw"}} className="ruletext"> Posts, </h5>
                                          </div>
                                          <div style={{display:"inline"}}>
                                          <input
                                          type="checkbox"
                                          checked={polls}
                                          style={{transform:"translateY(40%)"}}
                                          onChange={e => {
                                            setPolls(e.target.checked)}}
                                            />
                                            <h5 style={{marginRight:"1vw"}} className="ruletext"> Polls, </h5>
                                            </div>
                                            <div style={{display:"inline"}}>
                                            <input
                                            type="checkbox"
                                            checked={newMembers}
                                            style={{transform:"translateY(40%)"}}
                                            onChange={e => {
                                              setNewMembers(e.target.checked)}}
                                              />
                                              <h5 style={{marginRight:"1vw"}} className="ruletext"> New Members In Your Groups, </h5>
                                              </div>
                                              <div style={{display:"inline"}}>
                                            <input
                                            type="checkbox"
                                            checked={rules}
                                            style={{transform:"translateY(40%)"}}
                                            onChange={e => {
                                              setRules(e.target.checked)}}
                                              />
                                              <h5 style={{marginRight:"1vw"}} className="ruletext"> Rule Suggestions, </h5>
                                              </div>
                                              <div style={{display:"inline"}}>
                                                <input
                                                type="checkbox"
                                                checked={restriction}
                                                style={{transform:"translateY(40%)"}}
                                                onChange={e => {
                                                  setRestriction(e.target.checked)}}
                                                  />
                                                  <h5 style={{marginRight:"1vw"}} className="ruletext"> Restrictions </h5>
                                                  </div>
                                                  </div>
                                                  <h4>Tick the boxes below to recieve email notifications when new rules or restrictions for particular uses recieve approval from above 75% of the members</h4>
                                                  <div style={{display:"flex",flexWrap:"wrap"}}>
                                                  <div style={{display:"inline"}}>
                                                  <input
                                                  type="checkbox"
                                                  checked={rulesApproved}
                                                  style={{transform:"translateY(40%)"}}
                                                  onChange={e => {
                                                    setRulesApproved(e.target.checked)}}
                                                    />
                                                    <h5 style={{marginRight:"1vw"}} className="ruletext"> Rule Approval, </h5>
                                                    </div>
                                                    <div style={{display:"inline"}}>
                                                    <input
                                                    type="checkbox"
                                                    checked={restrictionsApproved}
                                                    style={{transform:"translateY(40%)"}}
                                                    onChange={e => {
                                                      setRestrictionsApproved(e.target.checked)}}
                                                      />
                                                      <h5 style={{marginRight:"1vw"}} className="ruletext"> Restriction Approval, </h5>
                                                      </div>
                                                      <div style={{display:"inline"}}>
                                                      <input
                                                      type="checkbox"
                                                      style={{transform:"translateY(40%)"}}
                                                      checked={eventsApproved}
                                                      onChange={e => {
                                                        setEventsApproved(e.target.checked)}}
                                                        />
                                                        <h5 style={{marginRight:"1vw"}}  className="ruletext"> Events Approved </h5>
                                                        </div>
                                                        </div>
                                                        <div className="signininput" style={{margin:"2vw",display:((numImages.length>=1)?"block":"none")}}>
                                                      <input style={{width:"100%"}} id="file" type="file" ref={selectedFile1}/>
                                                      </div>

                                                      <div className="signininput" style={{margin:"2vw",display:((numImages.length>=2)?"block":"none")}}>
                                                      <input style={{width:"100%"}} id="file" type="file" ref={selectedFile2}/>
                                                      </div>

                                                      <div className="signininput" style={{margin:"2vw",display:((numImages.length>=3)?"block":"none")}}>
                                                      <input style={{width:"100%"}} id="file2" type="file" ref={selectedFile3}/>
                                                      </div>

                                                      <div className="signininput" style={{margin:"2vw",display:((numImages.length>=4)?"block":"none")}}>
                                                      <input style={{width:"100%"}} id="file3" type="file" ref={selectedFile4}/>
                                                      </div>

                                                      <div className="signininput" style={{margin:"2vw",display:((numImages.length>=5)?"block":"none")}}>
                                                      <input style={{width:"100%"}} id="file4" type="file" ref={selectedFile5}/>
                                                      <p>Max 5 images</p>
                                                      </div>

                                                      <button onClick={(e) => extraImage(e)}>Add Extra Image</button>
                                                      <button onClick={(e) => lessImage(e)}>One Less Image</button>
                                                      {!loading&&<button id="submit" onClick={clickSubmit}>Submit</button>}
                                                      {loading&&<h3>...Uploading Changes</h3>}
                                                      {loadingComplete&&<h2>Upload Complete</h2>}
                                                      </div>
                                                      </div>
                                                    )}

                                                    </>
                                                  )
                                                }

import React, {useRef,useState,useEffect} from 'react'
import auth from '../auth/auth-helper'
import Axios from 'axios'
const axios = require('axios');
const mongoose = require("mongoose");



export default function CreateGroupForm(props) {
  const titleValue = React.useRef('')
  const descriptionValue = React.useRef('')
  const [uploading, setUploading] = useState(false);
  const [uploadComplete,setUploadComplete]=useState(false)
  const [errors, setErrors] = useState([]);
  const [failed, setFailed] = useState(false);
  const levelValue = React.useRef(0)
  const parentGroupValue = React.useRef('')
  const selectedFile1 = React.useRef(null)
  const [levels, setLevels] = useState([]);
  const [groups, setGroups] = useState(props.groups);
  const [subgroups,setSubgroups]=useState([]);
  const [user, setUser] = useState(props.user);
  const [toggle, setToggle] = useState(false);
  const [max, setMax] = useState(0);


  useEffect(()=>{
    setGroups(props.groups)
    let subgroups=props.groups.filter(item=>item.level==1)
    let max=props.groups.sort(function(a, b){return b.level-a.level});
    max=max[0]
    if(max){
      max=max.level
    }


    setSubgroups(subgroups)
  },[props])

  useEffect(()=>{
    fetch(`/groups/finduser/`+auth.isAuthenticated().user._id)
    .then(response => response.json())
    .then(data=>{
      let user=JSON.parse(JSON.stringify(data.data))

      let levels=[]
      for (let group of user[0].groupstheybelongto){
        levels.push(group.level)
      }
      console.log(user[0])
      levels=[...new Set(levels)]
      console.log("levels",levels)
      levels=levels.sort((a, b) => a - b)
      levels.pop()
      setLevels(levels)
    })
    .catch(error=>console.error(error))


  },[])


  function setUpperGroupOptions(){
    let subgroups=groups.filter(item=>item.level==(levelValue.current.value+1))
    setSubgroups(subgroups)

  }

function changing(){
  if (levelValue.current.value==2){

  }
  let errorscopy=[]

  if(!parentGroupValue.current.value&&auth.isAuthenticated().user.cool){
    errorscopy.push("You need to choose a parent group")
  }

  if(titleValue.current.value.length==0){
    errorscopy.push("You need a title")
  }

  if(!descriptionValue.current.value){
    errorscopy.push("You need a group description")
  }

  if(!levelValue.current.value&&auth.isAuthenticated().user.cool){
    errorscopy.push("You need to choose a group level")
  }

  if (errorscopy.length==0){
    setFailed(false)
  }


  setErrors(errorscopy)

}

  async function handleSubmit(e) {
    e.preventDefault()
if(errors.length>0){
  setFailed(true)
}

if (errors.length==0){


  setUploading(true)

  var groupId=mongoose.Types.ObjectId()
  groupId=groupId.toString()

  let imageids=[]

  if(selectedFile1.current.files[0]){
    const formData = new FormData();
    formData.append('file', selectedFile1.current.files[0]);
    formData.append("upload_preset", "jvm6p9qv");
    await Axios.post("https://api.cloudinary.com/v1_1/julianbullmagic/image/upload",formData)
    .then(response => {

      imageids.push(response.data.public_id)
    })
    .catch(err => {
      console.error(err);
    })
  }



  let d = new Date();
  let n = d.getTime();
let groupabove=auth.isAuthenticated().user.cool?parentGroupValue.current.value:null

  const newPost={
    _id:groupId,
    title: titleValue.current.value,
    groupabove:groupabove,
    description:descriptionValue.current.value,
    cool:auth.isAuthenticated().user.cool,
    timecreated:n,
    images:imageids,
    level:levelValue.current.value,
    members:[],
    centroid:auth.isAuthenticated().user.coordinates,
  }

  props.updateGroups(newPost)



  const options={
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-type": "application/json; charset=UTF-8"}}
      const optionstwo={
        method: "PUT",
        body: "",
        headers: {
          "Content-type": "application/json; charset=UTF-8"}}

          let groupid=await fetch("groups/creategroup", options)
          .then(response => response.json())
          .then(data=>{return data.data})
          .catch(err => {
            console.error(err);
          })

          await fetch("groups/addlowertohigher/"+groupid+"/"+parentGroupValue.current.value, optionstwo)
          .then(response => response.json())
          .then(json =>console.log(json))
          .catch(err => {
            console.error(err);
          })
          setUploading(false)
          setUploadComplete(true)
          setTimeout(() => {
      setUploadComplete(false)
      }, 5000)
}
          }


          return (
            <div className="homepageform">
            <form onSubmit={handleSubmit} onChange={changing}>
            <h3>You can make a group for anything. It could be for a geographic area or
            a particular subject or topic.</h3>
            <div className="titlediv">
            <label style={{display:"inline"}} htmlFor='name'>Title</label>
            <input
            style={{display:"inline",width:"80vw"}}
            type='text'
            name='titleValue'
            id='titleValue'
            ref={titleValue}
            />
            </div>
            <div className="titlediv">
            <label style={{display:"inline"}} htmlFor='name'>Description</label>
            <input
            style={{display:"inline",width:"76vw"}}
            type='text'
            name='descriptionValue'
            id='descriptionValue'
            ref={descriptionValue}
            />
            </div>

            {auth.isAuthenticated().user.cool&&
              <div style={{display:"inline"}}>
              <label style={{display:"inline"}} style={{display:"inline"}} htmlFor='name'>Choose a Level</label>
              <select style={{display:"inline"}} onChange={setUpperGroupOptions} ref={levelValue}>
              <option value=""></option>
              {!levels&&<option value="0">0</option>}
              {levels&&levels.map(item=><option value={item}>{item}</option>)}
              </select>
              </div>}

            {auth.isAuthenticated().user.cool&&
            <div style={{display:"inline"}}>
            <label htmlFor='name'>Choose a parent group</label>
            <select ref={parentGroupValue}>
            <option value=""></option>
            {subgroups&&subgroups.map(item=><option value={item._id}>{item.title}</option>)}
            </select>
            </div>}
            <div id="file" style={{display:"inline"}}>
            <label style={{display:"inline"}} htmlFor='name'>Image</label>
            <input style={{display:"inline",width:"30%"}} type="file" ref={selectedFile1}/>
            </div>
            <div>
            <label>You must choose a level before you can choose a parent group. You can only create a group at a level above zero
            if you have been elected to be a member of a higher level group.</label>
            </div>
            {(errors&&failed)&&errors.map(item=><p style={{color:"red"}}>{item}</p>)}
            {(!uploadComplete&&!uploading&&!failed)&&<button style={{margin:"1vw"}} type="submit" value="Submit">Submit</button>}
            {uploading&&<h3>uploading.....</h3>}
            {uploadComplete&&<h2>Upload Complete</h2>}
            </form>
            </div>
          )}

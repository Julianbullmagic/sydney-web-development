import React, {useState, useEffect} from 'react'
import ChatPage from "./../ChatPage/ChatPage"
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import auth from './../auth/auth-helper'
import {Image} from 'cloudinary-react'
import {Link} from "react-router-dom";
import GroupList from '../groups/GroupList'
const KmeansLib = require('kmeans-same-size');



export default function Home({history}){
  const [users, setUsers] = useState(false)


  useEffect(()=> {
getGroupData()
  }, [])

  async function getGroupData(){
    await fetch(`/groups/getusers`)
        .then(response => response.json())
        .then(data=>{
          console.log("users",data)
          setUsers(data)
        })
  }
    return (
      <>
      {!auth.isAuthenticated()&&<div style={{height:"100vh",overflow:"hidden"}}>
      <h5 style={{marginLeft:"5vw",marginRight:"5vw",marginTop:"3vw",width:"90vw"}}>On the Democratic Social Network, users are much more involved in
      creating and enforcing the rules and the overall running of each group. Democracy is not just
      voting every few years, it is something we should practice every day in all our relationships.
      Democracy is discussing, consulting and compromising in order to form mutually beneficial group
      decisions that most people are happy with, decisions that are much better informed than any
      individual could have arrived at on their own. Democracy is trying to persuade and convince instead
      of coerce. You don't need to wait for revolution to see the benefits of this.
      This app is a work  in progress, to offer constructive criticism or suggestions, or to
      report bugs, email democraticsocialnetwork@gmail.com.
      </h5>
      <img className="homeimg" src={require('./hands.png')} /></div>}
      {auth.isAuthenticated()&&<><GroupList />
        </>}
      </>
    )
}

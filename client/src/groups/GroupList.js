import React, { Component } from 'react';
import {Link} from "react-router-dom";
import { MapContainer, TileLayer,Circle} from 'react-leaflet'
import auth from './../auth/auth-helper'
import {Image} from 'cloudinary-react'
import CreateGroupForm from '../groups/CreateGroupForm'

var geodist = require('geodist')

class GroupsList extends Component {


  constructor(props) {
    super(props);

    this.state = {
      groups: [],
      vidone:[],
      vidtwo:[],
      allgroups:[],
      mygroups:[],
      user:{},
      page:1,
      pageNum:[],
      viewform:false,
      currentPageData:[],
    }
    this.viewAllGroups=this.viewAllGroups.bind(this)
    this.updateGroups=this.updateGroups.bind(this)
    this.searchGroups=this.searchGroups.bind(this)
    this.handleSearchChange=this.handleSearchChange.bind(this)
  }
  componentDidMount(){
    this.viewAllGroups()
let videos=["https://www.youtube.com/embed/tTBWfkE7BXU","https://www.youtube.com/embed/34LGPIXvU5M",
"https://www.youtube.com/embed/8ZoI0C1mPek","https://www.youtube.com/embed/x-oRmcYR5cM",
"https://www.youtube.com/embed/emnYMfjYh1Q","https://www.youtube.com/embed/Hgwtd4X_qFM",
"https://www.youtube.com/embed/lu8lQKVcbOs","https://www.youtube.com/embed/_swnWW2NGBI",
"https://www.youtube.com/embed/7IIEB5JiyNs","https://www.youtube.com/watch?v=sGZgWQaVwN8",
"https://www.youtube.com/embed/wCzS2FZoB-I","https://www.youtube.com/embed/uNkADHZStDE",
"https://www.youtube.com/embed/6s17IAj-XpU"]

    let randomVids = videos.sort(() => .5 - Math.random()).slice(0, 2);
    this.setState({vidone:randomVids[0],vidtwo:randomVids[1]})
  }

  updateGroups(newgroup){
    var groupscopy=JSON.parse(JSON.stringify(this.state.groups))
    groupscopy.reverse()
    groupscopy.push(newgroup)
    groupscopy.reverse()
    this.setState({groups:groupscopy})
  }

  searchGroups(event){
    if(this.state.searchterm.length>0){
      let groupscopy=JSON.parse(JSON.stringify(this.state.allgroups))
      groupscopy=groupscopy.filter(item=>item.title.toLowerCase().includes(this.state.searchterm.toLowerCase()))
      this.setState({groups:groupscopy})
    }
    if(this.state.searchterm.length==0){
      this.setState({groups:this.state.allgroups})
    }
  }

  handleSearchChange(event) {
    this.setState({searchterm:event.target.value})
  }

  viewAllGroups(){
    fetch(`/groups/finduser/`+auth.isAuthenticated().user._id)
    .then(response => response.json())
    .then(data=>{
      this.setState({user:data.data[0]})
    }).catch(error=>console.error(error))

    fetch('/groups/findgroups/'+auth.isAuthenticated().user.cool).then(res => {
      return res.json();
    }).then(blob => {
      let groups=JSON.parse(JSON.stringify(blob.data))
      groups.sort(() => Math.random() - 0.5);
      this.setState({groups:groups,allgroups:groups})
    }).catch(error=>console.error(error))
  }


  render() {

    var groupsmapped=<h3>no groups</h3>

    if(this.state.groups){groupsmapped=this.state.groups.map(item => {

      return(
        <>
        <Link key={item._id} className="gotogroup" exact to={"/group/" + item._id}>
        <div className="groupdiv" key={item._id}>
        <div>
        {item.title&&<h3 style={{display:"inline",margin:"0vw",padding:"0vw",overflowX:"hidden"}}>Title: {item.title&&item.title}  </h3>}
        {item.location&&<h4 style={{display:"inline",margin:"0vw",padding:"0vw",overflow:"hidden"}}>Location: {item.location}  </h4>}
        <h4 style={{display:"inline",margin:"0vw",padding:"0vw"}}>Level: {item.level}</h4>
        </div>
        </div>
        </Link>
        </>
      )
    })}




    let mygroupsmapped=[]

    let nogroups=false
    if(this.state.user){
      if(this.state.user.groupstheybelongto){
        if(this.state.user.groupstheybelongto.length==0){nogroups=true}
        mygroupsmapped=this.state.user.groupstheybelongto.map(item => {

          return(
            <>
            <div key={item._id} className="groupdiv" key={item._id}>
            <Link style={{margin:"0vw",padding:"0vw"}} className="gotogroup" exact to={"/group/" + item._id}>
            <div style={{margin:"0vw",padding:"0vw"}}>
            {item.title&&<h3 style={{display:"inline",margin:"0vw",padding:"0vw",overflowX:"hidden"}}>Title: {item.title&&item.title}</h3>}
            {item.location&&<h4 style={{display:"inline",margin:"0vw",padding:"0vw",overflow:"hidden"}}> Location: {item.location}</h4>}
            <h4  style={{display:"inline",margin:"0vw",padding:"0vw"}}> Level: {item.level}</h4>
            </div></Link>
            </div>
            </>
          )
        })
      }
    }

    return (
      <div className="groupslist" style={{marginTop:"6vh"}}>
      <div  style={{margin:"0vw"}}>
      <h1 className="groupstitle">Groups</h1>
      </div>
      <div>
      <button style={{}} onClick={(e) => this.setState({viewform:!this.state.viewform})}>View Create Group Form?</button>
      </div>
      <div style={{marginTop:"1vw",marginBottom:"0.5vw",maxHeight:!this.state.viewform?"0":"100vw",overflow:"hidden",transition:"max-height 2s"}}>
      <CreateGroupForm  updateGroups={this.updateGroups} groups={this.state.groups} user={this.state.user}/>
      </div>


      <div className='yourgroups'>
      <div className='groupdivtwo'>
      <h2 style={{marginLeft:"2.5vw",margin:"0.5vw"}}>Your Groups</h2>
      </div>
      <div style={{display:"flex",flexWrap:"wrap"}}>
      {nogroups&&<h4 style={{marginLeft:"2.5vw",margin:"0.5vw"}}>You haven't joined any groups yet, click on the group link below.
      Join some groups, make suggestions and vote for rules. Post an introduction about yourself. You can only join a
      maximum of three bottom level groups. If you leave one group, your votes are still recorded but not counted.
      If you choose to rejoin, they will count again.</h4>}
      {mygroupsmapped}
      </div>
      </div>
      <section className='groupsbox'>
      <div className='groupscol1'>
      <div className='groupdivtwo'>
      <h2 style={{marginLeft:"2.5vw",margin:"0.5vw",display:"inline"}}>All Groups</h2>
      <input style={{width:"63vw",marginLeft:"2.5vw",margin:"0.5vw",display:"inline"}} placeholder="enter search term" onChange={(e)=>this.handleSearchChange(e)}></input>
      <button style={{marginLeft:"2.5vw",margin:"0.5vw",display:"inline"}} onClick={(e)=>this.searchGroups(e)}>Search All Groups</button>
      </div>
      <div style={{display:"flex",flexWrap:"wrap"}}>
      {groupsmapped}
      </div>
      </div>
      </section>
      <br/>
      {auth.isAuthenticated().user.cool&&<>
        <div className="vids">
      <iframe style={{margin:"0.5vw",width:"44vw",height:"44vh",display:"inline"}} src={this.state.vidone} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      <iframe style={{margin:"0.5vw",width:"44vw",height:"44vh",display:"inline"}} src={this.state.vidtwo} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      </>}
      </div>
    );
  }
}

export default GroupsList;

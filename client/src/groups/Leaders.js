import React, { Component } from 'react';
import {Image} from 'cloudinary-react'
import CreateRuleForm from './CreateRuleForm'
import auth from './../auth/auth-helper'
import io from "socket.io-client";
const mongoose = require("mongoose");

let leaders=[]

export default class Leaders extends Component {

  constructor(props) {
    super(props);
    for (let user of props.users){
      if(props.group.groupabove){
        if (props.group.groupabove.members.includes(user._id)){

          leaders.push(user)
        }
      }
    }
    leaders=[...new Set(leaders)]
    let userscopy=props.users
    userscopy=userscopy.sort(() => Math.random() - 0.5);
    userscopy=userscopy.sort(() => Math.random() - 0.5);
    this.state = {
      users:userscopy,
      viewexplanation:false,
      group:props.group,
      leaders:leaders,
      redirect: false,
      updating:false,
      participate:props.participate
    }
  }


  componentWillReceiveProps(nextProps) {
    let userscopy=JSON.parse(JSON.stringify(nextProps.users))
userscopy=userscopy.sort(() => Math.random() - 0.5);
userscopy=userscopy.sort(() => Math.random() - 0.5);

    if (nextProps.users !== this.props.users) {

      this.setState({
        users:userscopy
      });
    }

    if (nextProps.group !== this.props.group) {

      this.setState({
        group:nextProps.group
      });
    }
    for (let user of this.state.users){
      if(this.state.group.groupabove){
        if (this.state.group.groupabove.members.includes(user._id)){
          leaders.push(user)
        }
      }
    }

    leaders=[...new Set(leaders)]

    this.setState({leaders:leaders})
  }


  approveofuser(e,id){

    var userscopy=JSON.parse(JSON.stringify(this.state.users))
    let vote=`${this.state.group.title},${this.state.group.level},${auth.isAuthenticated().user._id}`
    let numreps=Math.round(userscopy.length/25)

    for (let user of userscopy){
      let votesfrommembers=[]
      let memberids=this.state.group.members.map(item=>item._id)

      for (let vote of user.votes){
        let splitvote=vote.split(",")
        if (memberids.includes(splitvote[2])){
          votesfrommembers.push(vote)
        }
      }
      user.votes=votesfrommembers
      let splitvote=`${this.state.group.title},${this.state.group.level}`
      if(!user.votes){
        user.votes=[]
      }
      if (user.votes){
        user.votes=user.votes.filter(item=>item.startsWith(splitvote))
      }
    }

    for (let user of userscopy){
      if (user._id==id){
        if(!user.votes.includes(vote)){
          user.votes.push(vote)
          let splitvote=vote.split(',')
          splitvote.pop()
          splitvote.join(",")
          user.votes=user.votes.filter(item=>item.startsWith(splitvote))
        }
      }
    }
    let unsorted=JSON.parse(JSON.stringify(userscopy))
    userscopy.sort((a, b) => (a.votes.length < b.votes.length) ? 1 : -1)

    let leaders=userscopy.slice(0,numreps)
    this.setState({leaders:leaders})


    const options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: ''
    }


    this.setState({users:unsorted})


    fetch("/leaders/voteforleader/" + id +"/"+ vote, options
  ).then(res => {

  }).catch(err => {
    console.error(err);
  })

  for (let user of this.state.users){
    if (this.state.group.groupabove.members.includes(user._id)){
      leaders.push(user)
    }
  }
  leaders=[...new Set(leaders)]

  this.setState({leaders:leaders})

}


withdrawapprovalofuser(e,id){
  var userscopy=JSON.parse(JSON.stringify(this.state.users))
  let numreps=Math.round(userscopy.length/25)

  let vote=`${this.state.group.title},${this.state.group.level},${auth.isAuthenticated().user._id}`

  for (var user of userscopy){
    let votesfrommembers=[]
    let memberids=this.state.group.members.map(item=>item._id)

    for (let vote of user.votes){
      let splitvote=vote.split(",")
      if (memberids.includes(splitvote[2])){
        votesfrommembers.push(vote)
      }
    }
    user.votes=votesfrommembers
    if (user._id==id){
      var filteredapproval=user.votes.filter(voted=>!(voted==vote))
      user.votes=filteredapproval
    }
  }

  this.setState({users:userscopy})

  const options = {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: ''
  }

  fetch("/leaders/withdrawvoteforleader/" + id +"/"+ vote, options
) .then(res => {
console.log(res)
}).catch(err => {
  console.error(err);
})
}





render(props) {

  let userscomponent
  if (this.state.users){

    userscomponent=this.state.users.map(item => {
      let splitvote=`${this.state.group.title},${this.state.group.level}`

      if(!item.votes){
        item.votes=[]
      }

      if(item.votes){
        item.votes=item.votes.filter(item=>item.startsWith(splitvote))

        let votesfrommembers=[]
        let memberids=this.state.group.members.map(item=>item._id)

        for (let vote of item.votes){
          let splitvote=vote.split(",")
          if (memberids.includes(splitvote[2])){
            votesfrommembers.push(vote)
          }
        }
        item.votes=votesfrommembers
      }
      let vote=`${this.state.group.title},${this.state.group.level},${auth.isAuthenticated().user._id}`
      let votees=[]
      if(item.votes.length>0){
        for (let vote of item.votes){
          let splitvote=vote.split(',')

          for (let user of this.state.users){
            if (user._id==splitvote[2]){

              votees.push(user.name)
            }
          }
        }
      }
      let width=`${(item.votes.length/this.state.group.members.length)*100}%`

      console.log("width",width,item.votes)

      return(
        <>
        <div key={item._id} className="rule">
        <h3 className="ruletext">{item.name}  </h3>
        {(!item.votes.includes(vote))&&<button style={{display:'inline'}} className="ruletext" onClick={(e)=>this.approveofuser(e,item._id)}>Vote For This Person?</button>}
        {(item.votes.includes(vote))&&<button style={{display:'inline'}} className="ruletext" onClick={(e)=>this.withdrawapprovalofuser(e,item._id)}>Withdraw Vote?</button>}
        {votees.length>0&&<p style={{display:'inline'}}>People who voted: </p>}
        {votees&&votees.map((item,index)=>{return(<><p style={{display:'inline'}}>{item}{(index<(votees.length-2))?", ":(index<(votees.length-1))?" and ":"."}</p></>)})}
        <div className="percentagecontainer"><div style={{width:width}} className="percentage"></div></div>
        </div>
        </>
      )})
    }

    let inthisgroup=this.state.group.members.map(item=>item._id)
    inthisgroup=inthisgroup.includes(auth.isAuthenticated().user._id)

    return (
      <>
      <div style={{marginBottom:"20vw"}}>
      <br />
      <h2>Group Leaders</h2>
      {this.state.group.level==2&&<h4>The highest level group, Australia, has no singular leader, prime minister, president or chancellor</h4>}

      {this.state.leaders.length>0&&this.state.leaders.map(item=><><div className="leader"><h3 style={{margin:"0.5vw"}}>{item.name}</h3></div></>)}
      {this.state.leaders.length==0&&<h4>No leaders</h4>}
      <button onClick={(e) => this.setState({viewexplanation:!this.state.viewexplanation})}>View Explanation</button>
      <div className="leaderexpl" style={{maxHeight:!this.state.viewexplanation?"0":"300vw",overflow:"hidden"}}>
        {this.state.users.length<13&&<><p>Each group larger than 25 members will have two representatives, one male and the other female.
          If all members are only one sex, they cannot choose any representatives.
          If the group is smaller than 25 members large, you can still vote for people in this group. These votes will be recorded in the database and counted if the group
         should become large enough. We have a sorting algorithm that ensures
          all people outside of the two main sex groups are proportionally represented, however male and female
          are the largest ones and will mostly be chosen (purely based on population size). Most capitalist
          parliaments or congresses are less than a third female, giving hugely disproportionate and unfair
          representation to men. If we hope to reduce the gender pay gap, high cost of childcare, the disproportionate
          amount of unpaid housework, rates of teenage pregnancy and many other distinctly female problems,
          a more humanistic political system is needed.</p></>
        }
        Representatives from higher level groups are not allowed to nominate or endorse candidates in lower level groups.
        This helps to ensure a genuine grassroots organization. There are no election campaigns on this
        web application. However, you can explain your skills, qualifications and experience on your profile page and others
        can inspect this. Each candidate will be assessed on their merits by the people they represent. We don't
        want an oligarchy to limit or influence the choice of candidates.
        You could also post a resume in your groups for other members to look at and evalutate your credentials. This
        is intended to create a genuine meritocracy, the choice of leaders or experts should be purely based on their skill, experience,
        trustworthyness, moral integrity and
        knowledge. It should have nothing to do with how much money people have to spend on a political marketing campaigns or how much control they have over the media.
        In order to prevent a situation where people get selected simply because they were first to get any votes, all elected leaders
        must receive at least 75% approval from their group and the most popular members above this threshold can become representatives.
        When you choose who to vote for, try to priortise their actual credentials instead of whether or not you like them personally.
        The democratic social network tries to prevent demagoguery. This is a phenomenon where people gain influence simply with charm
        and charisma, while they may not actual have the competence for leadership. A demagogue is sort of like a sociopath,
        very manipulative and cunning, but the term
        refers particularly to political leaders. It is nice if leaders are likeable and friendly, but
        this should not be the priority. A real leader tells you what you need to hear, not just what you want to hear.
        Only two leaders are chosen from each group, however there may be many members who happen to all be
        equally and most popular. For this reason, every three months, two leaders are chosen randomly from this
        group.
        </div>
      <hr/>
      {inthisgroup&&<><h3>Vote for Members</h3>
        {this.state.users.length<1&&<h4>No members</h4>}
        {userscomponent}</>}
        </div>
        </>
      );
    }
  }

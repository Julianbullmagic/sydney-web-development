import React, { Component } from 'react';
import auth from './../auth/auth-helper'
import { MapContainer, TileLayer,Circle, Marker, Popup} from 'react-leaflet'
import {Link,BrowserRouter} from "react-router-dom";
import {Image} from 'cloudinary-react'



class GroupDetails extends Component {


  constructor(props) {
    super(props);

    this.state = {
      group:props.group
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.group !== this.props.group) {
      this.setState({
        group:nextProps.group
      })
    }
  }




  render(){


    return (
      <React.Fragment>
      <div className="details">
      <div className="detailscol1">
      <h2>Group Details</h2>
      {this.state.group.title&&<p><strong>Group Title: </strong> {this.state.group.title}</p>}
      {this.state.group.location&&<p><strong>Location: </strong> {this.state.group.location}</p>}
      <p><strong>Level: </strong> {this.state.group.level}</p>
      {this.state.group.description&&<p><strong>Description: </strong> {this.state.group.description}</p>}
      {this.state.group.groupabove&&<p><strong>Group Above: </strong></p>}
      {this.state.group.groupabove&&
        <><BrowserRouter style={{display:"inline"}} forceRefresh={true}><Link className="gotogroup" exact to={"/groups/" + this.state.group.groupabove._id}><button style={{color:"white",padding:"0.5vw"}}>{this.state.group.groupabove.title}</button></Link></BrowserRouter></>}
        {(this.state.group.groupsbelow&&(this.state.group.level>0))&&<p><strong>Groups Below: </strong></p>}

        {(this.state.group.groupsbelow&&(this.state.group.level>0))&&this.state.group.groupsbelow.map((item,index)=>
          {return <BrowserRouter forceRefresh={true} style={{display:"inline"}}><Link className="gotogroup" exact to={"/groups/" + item._id}><button><p style={{color:"white",display:"inline"}}>{item.title}</p></button></Link></BrowserRouter>})}
          {(this.state.group.centroid&&this.state.group.groupsbelow&&this.state.group.type=="localgroup")&&<p style={{color:"white"}}>All the small circles on the map roughly show the spread of members of this whole group. The different colours
          represent each of the groups that are children of this group. The small spots do not actually show the locations
          of members but approximately show the area covered by each group.</p>}
          </div>
          <br/>
          <div className="detailscol2">
          {(this.state.group.images&&this.state.group.images.length>0)&&<Image className="detailsimg"
          cloudName="julianbullmagic" publicId={this.state.group.images[0]} />}
          </div>
          </div>
          </React.Fragment>
        );
      }
    }

    export default GroupDetails;

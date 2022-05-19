import React, {useState,useRef,useEffect} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import {create} from './api-user.js'
import {Link} from 'react-router-dom'
import auth from './../auth/auth-helper'
import {Image} from 'cloudinary-react'
import io from "socket.io-client";
import Axios from 'axios'
const mongoose = require("mongoose");

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },

}))

export default function Signup (){
  const classes = useStyles()
  const [numImages, setNumImages] = useState([0]);
  const [loading,setLoading]=useState(false);
  const [togglesex,setTogglesex]=useState(false);
  const [values, setValues] = useState({
    name: '',
    password: '',
    passwordtwo:'',
    passworderror:false,
    coordinates:'',
    politicalparties:'',
    sex:"female",
    passiveincome:false,
    location:'',
    securityquestionone:'',
    securityquestiontwo:'',
    groupsCoordinates:'',
    address:'',
    email: '',
    phone:'',
    expertise:'',
    images:'',
    error:'',
    open: false,
  })
  const selectedFile1 = React.useRef(null)
  const selectedFile2 = React.useRef(null)
  const selectedFile3 = React.useRef(null)
  const selectedFile4 = React.useRef(null)
  const selectedFile5 = React.useRef(null)
  let server = "http://localhost:5000";
  let socket = io(server);

  useEffect(()=>{

  },[numImages,setNumImages])

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



  async function createUser(){
    if(!(values.password==values.passwordtwo)){
      setValues({ ...values, passworderror:true})
    }


    if(values.password==values.passwordtwo){

      setValues({ ...values, passworderror:false})

      setLoading(true)

      var userId=mongoose.Types.ObjectId()

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

                let cool=true

                if (values.politicalparties.toLowerCase().includes("labour")||values.politicalparties.toLowerCase().includes("liberal")
                ||values.politicalparties.toLowerCase().includes("socialist alternative")||values.politicalparties.toLowerCase().includes("resistance")
                ||values.politicalparties.toLowerCase().includes("greens"||values.politicalparties.toLowerCase().includes("national")
                ||values.politicalparties.toLowerCase().includes("united"))){
                  cool=false
                }


                if (Boolean(values.passiveincome)){
                  cool=false
                }

                const user = {
                  _id:userId,
                  name: values.name || undefined,
                  phone: values.phone || undefined,
                  email: values.email || undefined,
                  sex:values.sex,
                  cool:cool,
                  expertise: values.expertise || undefined,
                  images:imageids,
                  password: values.password || undefined
                }

                console.log(user)
                create(user).then((data) => {
                  if (data.error) {
                    setValues({ ...values, error: data.error})
                  } else {
                    setValues({ ...values, error: '', open: true})
                  }
                })

                setLoading(false)

              }

            }

            function handleSexChange(e,sex){
              console.log(values,togglesex)
              setTogglesex(!togglesex)
              setValues({ ...values, sex: sex })
            }

            const handleChange = name => event => {

              setValues({ ...values, [name]: event.target.value })
            }
            const handleCheckboxChange = name => event => {


              setValues({ ...values, [name]: event.target.checked })
            }

            const clickSubmit = (e) => {
              createUser()
            }

            return (


              <div className="signupform">

              <h2  className="innersignupform" style={{display:(loading?"block":"none")}}>Uploading profile, please wait...</h2>

              <div className="innersignupform" style={{display:(!loading?"block":"none")}}>
              <h4 style={{textAlign:"center"}}>
              Sign Up
              </h4>
              <div className="signupinput"><h5 style={{marginRight:"1vw"}} className="ruletext">Name </h5><input id="name" placeHolder={values.name} label="text" value={values.name} onChange={handleChange('name')} margin="normal"/></div>
              <div className="signupinput"><h5 style={{marginRight:"1vw"}} className="ruletext">Email </h5><input id="email" placeHolder={values.email} type="text" label="Email" value={values.email} onChange={handleChange('email')} margin="normal"/></div>
              <div className="signupinput"><h5 style={{marginRight:"1vw"}} className="ruletext">Phone </h5><input id="phone" placeHolder={values.phone} type="text" label="Phone" value={values.phone} onChange={handleChange('phone')} margin="normal"/></div>
              <div style={{margin:"1vw"}}><h5 style={{marginRight:"1vw",display:"block"}}>
              Try to explain your skills, knowledge, experience, qualifications. You may be elected as a leader of a group and other group members
              need some way of evaluating if you are a good candidate.</h5>
              <textarea style={{width:"95%",height:"20vh",overflowY:"auto",display:"block"}} id="expertise" placeHolder={values.expertise} label="expertise" value={values.expertise} onChange={handleChange('expertise')} margin="normal"/></div>

              <div className="signupinput" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
              <h5 style={{marginRight:"1vw"}} className="ruletext">Are you male or female? If you identify as another category please write it below.
              We are aiming for proportionate representation for all demographic groups.</h5>
              <h6 style={{display:"inline"}}>Male</h6><input id="expertise" checked={togglesex} style={{margin:"0.5vw",display:"inline"}} type="checkbox" onClick={e=>handleSexChange(e,'male')} margin="normal"/>
              <h6 style={{display:"inline"}}>Female</h6><input id="expertise" checked={!togglesex} style={{margin:"0.5vw",display:"inline"}} type="checkbox" onClick={e=>handleSexChange(e,'female')} margin="normal"/>
              </div>
              <input style={{width:"95%"}} id="expertise" type="text"/>
              <div className="signupinput"><h5 style={{marginRight:"1vw"}} className="ruletext">
              Are you a member of any political parties? If so, which ones? </h5>
              <input id="expertise" type="text" placeHolder={values.politicalparties} label="expertise" value={values.politicalparties} onChange={handleChange('politicalparties')} margin="normal"/></div>

              <div className="signupinput" style={{display:"none",alignItems:"center",justifyContent:"center"}}><h5 style={{display:"none",marginRight:"1vw"}} className="ruletext">
              Do you receive any passive income from rents, dividends, interest or royalties? We are curious
              if you are a working class person. </h5>
              <input style={{display:"none"}} id="expertise" type="checkbox" value={false} onChange={handleCheckboxChange('passiveincome')} margin="normal"/></div>
              <div className="signupinput">
              <h5 className="ruletext">  Images </h5>
              <div style={{display:((numImages.length>=1)?"block":"none")}}  className="eventformbox ruletext">
              <input id="file" type="file" ref={selectedFile1}/>
              </div>
              </div>

              <div style={{display:((numImages.length>=2)?"block":"none")}} className="eventformbox ruletext">
              <input style={{width:"90%"}} id="file" type="file" ref={selectedFile2}/>
              </div>

              <div style={{display:((numImages.length>=3)?"block":"none")}}  className="eventformbox ruletext">
              <input style={{width:"90%"}} id="file" type="file" ref={selectedFile3}/>
              </div>

              <div style={{display:((numImages.length>=4)?"block":"none")}}  className="eventformbox ruletext">
              <input style={{width:"90%"}} id="file" type="file" ref={selectedFile4}/>
              </div>

              <div style={{display:((numImages.length>=5)?"block":"none")}}  className="eventformbox ruletext">
              <input style={{width:"90%"}} id="file" type="file" ref={selectedFile5}/>
              <p>Max 5 images</p>
              </div>

              <div className="signupinput"><h5 style={{marginRight:"1vw"}} className="ruletext">Password </h5><input id="password" type="password" placeHolder={values.password} label="Password" value={values.password} onChange={handleChange('password')} margin="normal"/></div>
              <div className="signupinput"><h5 style={{marginRight:"1vw"}} className="ruletext">Confirm Password </h5><input id="passwordtwo" type="password" placeHolder={values.passwordtwo} label="Confirm Password" value={values.passwordtwo} onChange={handleChange('passwordtwo')} margin="normal"/></div>
              {(!(values.password==values.passwordtwo)&&!(values.passwordtwo==""))&&<h5 style={{marginRight:"1vw",color:"red"}} className="ruletext">Passwords Do Not Match</h5>}
              {(values.passworderror&&(!(values.password==values.passwordtwo)&&!(values.passwordtwo=="")))&&<h5 style={{marginRight:"1vw",color:"red"}} className="ruletext">Cannot Submit, Must Fix Errors</h5>}
              <button onClick={(e) => extraImage(e)}>Add Extra Image</button>
              <button onClick={(e) => lessImage(e)}>One Less Image</button>
              <button id="submit" onClick={clickSubmit}>Submit</button>
              <br/> {
                values.error && (<Typography component="p" color="error">
                <Icon color="error" className={classes.error}>error</Icon>
                {values.error}</Typography>)
              }
              </div>
              <Dialog open={values.open} disableBackdropClick={true}>
              <DialogTitle>New Account</DialogTitle>
              <DialogContent>
              <DialogContentText>
              New account successfully created.
              </DialogContentText>
              </DialogContent>
              <DialogActions>
              <Link to="/signin">
              <button>
              Sign In
              </button>
              </Link>
              </DialogActions>
              </Dialog>
              </div>

            )
          }

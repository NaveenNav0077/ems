import React,{ useState, useEffect } from 'react'
import './Authendication.scss'
import Axios from 'axios'

export default function Authendication({ setStore, state }) {
    const [auth,setAuth] = useState(false);    

    const [userInfo, setUserInfo] = useState({ username:'', password:'', phoneNumber:'' });
    
    useEffect(()=>{
        if(state?.auth?.result?.admin===true && state.employes==null){
            getEmployes(state?.auth?.token)
        }
        if(state.selectd!==null){
            setUserInfo(state.selectd)
        }
    },[state?.auth?.result?.admin, state.selectd])

    async function getEmployes(token){
        Axios.create({
            baseURL:'https://ems-server-in.herokuapp.com',
            headers:{ 
                Authorization: `Bearer ${token}`   
            }
        }).get(`/employee/`)
        .then((res)=>{
            setStore({ auth:state.auth, selectd:state.selectd, employees:res.data })
        })
    }

    async function createEmployes(){
        Axios.create({
            baseURL:'https://ems-server-in.herokuapp.com',
            headers:{ 
                Authorization: `Bearer ${state.auth.token}`   
            }
        }).post(`/employee/`, userInfo)
        .then((res)=>{
            getEmployes(state.auth.token)
        })
    }

    async function updateEmployes(){
        if(state.selectd!==null){
            //console.log(state.selectd)
            Axios.create({
                baseURL:'https://ems-server-in.herokuapp.com',
                headers:{ 
                    Authorization: `Bearer ${state?.auth?.token}`   
                }
            }).put(`/employee/${state.selectd._id}`, userInfo)
            .then((res)=>{
                if(res.data.status===200){
                    setUserInfo({ username:'', password:'', phoneNumber:'' })
                    if(state?.auth?.result?.admin===true){
                        getEmployes(state.auth.token)
                    } else {
                        const emlployee = []
                        emlployee.push(res?.data?.result);
                        setStore({...state, employees:{ result:emlployee } })
                    }
                    
                }
            })
        }
    }

    async function deleteEmployes(){
        Axios.create({
            baseURL:'https://ems-server-in.herokuapp.com',
            headers:{ 
                Authorization: `Bearer ${state.auth.token}`   
            }
        }).delete(`/employee/${state.selectd._id}`)
        .then((res)=>{
            if(res.data.status===200){
                setUserInfo({ username:'', password:'', phoneNumber:'' })
                getEmployes(state.auth.token)
            }
        })
    }

    async function sendAuthRequest(){
        try{
            if(auth){
                Axios.post("https://ems-server-in.herokuapp.com/auth/signin", userInfo).then((res)=>{
                    if(res.data.status===200){ 
                        setStore({ ...state, auth:res.data})
                    } else {
                        console.log(res.data)
                    }   
                })                  
            } else {
                Axios.post("https://ems-server-in.herokuapp.com/auth/login", userInfo).then((res)=>{
                    if(res.data.status===200){
                        if(res?.data?.result?.admin===false){
                            const emlployee = []
                            emlployee.push(res?.data?.result);
                            setStore({ ...state, auth:res.data, employees:{ result:emlployee }})
                        } else {
                            setStore({ ...state, auth:res.data})
                        }
                    } else {
                        console.log(res.data)
                    }   
                })   
            }   
        } catch (e){
          console.log(e);
        }   
    }

    function setUserData(e){
        setUserInfo((pre)=>{
            return {
                ...pre,
                [e.target.name]:e.target.value
            }
        })
    }
    return (
      <div className='Authendication'>
          <div className='auth-container'>
              {
                state?.auth?.status === 200 ? (
                    <>
                        <input className="input one" type="text" name="username" value={userInfo.username} placeholder='Username' onChange={(e)=>setUserData(e)}/>
                        { state?.auth?.result?.admin && <input className="input" type="text" name="password" value={userInfo.password} placeholder='Password'  onChange={(e)=>setUserData(e)}/> }
                        <input className="input" type="text" name="phoneNumber" value={userInfo.phoneNumber} placeholder='Phone Number'  onChange={(e)=>setUserData(e)}/> 
                        <div className='array-buttons'>
                            <div className='array-button-element' onClick={()=>updateEmployes()}>Update</div>
                            {   
                                state?.auth?.result?.admin && (
                                    <>
                                        <div className='array-button-element' onClick={()=>createEmployes()}>Create</div>
                                        <div className='array-button-element' onClick={()=>deleteEmployes()}>Delete</div>
                                    </>
                                )
                            }
                        </div>
                    </>
                ) : (
                    <>
                        <input className="input one" type="text" name="username" value={userInfo.username} placeholder='Username' onChange={(e)=>setUserData(e)}/>
                        <input className="input" type="text" name="password" value={userInfo.password} placeholder='Password'  onChange={(e)=>setUserData(e)}/>
                        { auth && <input className="input" type="text" name="phoneNumber" value={userInfo.phoneNumber} placeholder='Phone Number'  onChange={(e)=>setUserData(e)}/> }
                        <button className="button" onClick={()=>sendAuthRequest()} >{ auth ? "SignIn" : "LogIn" }</button>
                        <p onClick={()=>setAuth(!auth)} className="auth-text">click if new user</p>
                    </>
                )
              }
          </div>
      </div>
    )
}

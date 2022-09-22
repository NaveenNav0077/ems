import React,{ useEffect } from 'react'
import './Dashboard.scss'

export default function Dashboard({ setStore, state }) {  
    useEffect(()=>{
        if(state.selectd===null && state.employees?.result?.length==1){
            setStore({...state, selectd:state.employees?.result[0] })
        }
    },[state])

    const selectedEmploye = (employee)=>{
        setStore({...state, selectd:employee })
    }

    return (
        <div className='Dashboard'>
            <div className="tag tag-title">
                <div className='tag-element'>User Name</div>
                <div className='tag-element'>Password</div>
                <div className='tag-element'>Mobile No</div>
            </div>
            <div className='tags-container'>
                {
                    state?.employees?.result.map((employee, key)=>{
                        return (
                            <div className="tag" key={key} onClick={()=>selectedEmploye(employee)}>
                                <div className='tag-element'>{employee.username}</div>
                                <div className='tag-element'>{employee.password}</div>
                                <div className='tag-element'>{employee.phoneNumber}</div>
                            </div>
                        )
                    })
                }      
            </div>
        </div>
    )
}

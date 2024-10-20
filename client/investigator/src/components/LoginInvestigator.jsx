import {React, useState} from 'react';
import axios from 'axios';
export default function LoginInvestigator (){
    const [email,setemail] = useState("");
    const [password,setPassword] = useState("");
    
    const handleLoginFormSubmit = async(e) => {
        e.preventDefault();
        try{
        const formData ={
            email:email,
            password:password
        };
        const res = await axios.post('http://localhost:3000/api/investigator/login', formData);
        const token = res.data.token;
        localStorage.setItem('token',token);
    }catch(err){
         alert(res.data.message);
    }
    }

    const handleEmail = (e) =>{
         setemail(e.target.value);
    }
    const handlePassword = (e)=>{
        setPassword(e.target.value);
    }

    return (
    <div>
        <form onSubmit={handleLoginFormSubmit}>
       <input value={email} onChange={handleEmail} type = "email" placeholder='Enter your email here'></input>
       <input value={password} onChange={handlePassword} type='password' placeholder='Enter password here'></input>
       <button type='submit'>Login</button>
       </form>
    </div>
    )
}
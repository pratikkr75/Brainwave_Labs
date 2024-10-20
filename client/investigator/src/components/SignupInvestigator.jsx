import {React, useState} from 'react';
import axios from 'axios';
export default function SignupInvestigator (){
    const [email,setemail] = useState("");
    const [password,setPassword] = useState("");
    const [firstname,setFirstName] = useState("");
    const [lastname,setLastName] = useState("");
    const handleLoginFormSubmit = async(e) => {
        e.preventDefault();
        try{
        const formData ={
            firstname:firstname,
            lastname:lastname,
            email:email,
            password:password
        };
        const res = await axios.post('http://localhost:3000/api/investigator/signup', formData);
        alert(res.data.message);
    }catch(err){
        alert(err.response.data.message);

        console.log(err);
 

            // alert(err.response.data.errors[0].message);
 
    }}

    const handleLastName = (e) =>{
        setLastName(e.target.value);
   }
    const handleFirstName = (e) =>{
        setFirstName(e.target.value);
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
        <input value={firstname} onChange={handleFirstName} type = "text" placeholder='Enter your first name here'></input>
        <input value={lastname} onChange={handleLastName} type = "text" placeholder='Enter your last name here'></input>
       <input value={email} onChange={handleEmail} type = "email" placeholder='Enter your email here'></input>
       <input value={password} onChange={handlePassword} type='password' placeholder='Enter password here'></input>
       <button type='submit'>Signup</button>
       </form>
    </div>
    )
}
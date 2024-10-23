import {React, useState} from 'react';
import axios from 'axios';
export default function SignupInvestigator (){
    const [email,setemail] = useState("");
    const [password,setPassword] = useState("");
    const [firstname,setFirstName] = useState("");
    const [lastname,setLastName] = useState("");
    const handleSignupFormSubmit = async(e) => {
        e.preventDefault();
        try{
        const formData ={
            firstname:firstname,
            lastname:lastname,
            email:email,
            password:password
        };
        const res = await axios.post('http://localhost:3000/api/admin/signup', formData);
        alert(res.data.message);
    }catch(error){
            if (error.response && error.response.data && error.response.data.errors) {
              const backendErrors = error.response.data.errors;
              const errorObj = {};
              backendErrors.forEach((err) => {
                errorObj[err.path] = err.message;
                alert(err.message);
              });
              setErrors(errorObj); // Set errors in state
            } else {
              alert(error.response.data.message);
            }}}

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
        <form onSubmit={handleSignupFormSubmit}>
        <input value={firstname} onChange={handleFirstName} type = "text" placeholder='Enter your first name here'></input>
        <input value={lastname} onChange={handleLastName} type = "text" placeholder='Enter your last name here'></input>
       <input value={email} onChange={handleEmail} type = "email" placeholder='Enter your email here'></input>
       <input value={password} onChange={handlePassword} type='password' placeholder='Enter password here'></input>
       <button type='submit'>Create Account</button>
       </form>
    </div>
    )
}
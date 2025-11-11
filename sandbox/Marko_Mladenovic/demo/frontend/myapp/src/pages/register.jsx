import 'bootstrap/dist/css/bootstrap.min.css'

import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

function Register(){
const [formData, setFormData] = useState({
        username:'',
        password:'',
    });

    const navigate = useNavigate();

    const handleSubmit = (e) =>{
        e.preventDefault();
        register();
    }

    const register = () => {
        fetch('http://localhost:5246/api/User/register/',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password
            })
        })
        .then(res => {
            if(res.status != 200){
                alert('Greska!');
                return;
            }
            else {
                console.log(res);
                return res.json()}
            }
            )
        .then(data => {
            if(data == undefined) return;
            console.log(data);
            if(data.message == "success"){
                console.log('lalala');
                alert('Uspesna registracija!');
                //navigate('/home');
            }
            else {
                alert('Error!\nTry again!');
            }
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    return (
        <div className='container bg-dark border-top-5' style={{padding:'10px', borderRadius:'8px', width:'400px'}}>
        <h3 className='text-primary' style={{textAlign:'center'}}>Register a new account!</h3>
        <form onSubmit={handleSubmit}>
            <label htmlFor='username' className='form-label text-secondary'>Input Your Username</label>
            <input type='text' className='form-control' id='username' name='username' value={formData.username} onChange={handleChange} required></input>
            
            <label htmlFor='password' className='form-label text-secondary'>Input Your Password</label>
            <input type='password' className='form-control' id='password' name='password' value={formData.password} onChange={handleChange} required></input>
            
            <button type='submit' className='btn btn-primary' style={{marginTop:'5px'}}>Register</button>
        </form>
    </div>
    )
}

export default Register;
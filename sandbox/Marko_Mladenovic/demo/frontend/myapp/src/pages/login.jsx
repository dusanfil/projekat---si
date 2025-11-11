import 'bootstrap/dist/css/bootstrap.min.css'

import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

function LogIn(){
    const [formData, setFormData] = useState({
        username:'',
        password:'',
    });

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:5246/api/User/checkLogin/',
            {
                method:'POST',
                credentials:"include"
                ,
                headers:{
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                },
                
            )
            })
        .then(res => res.json())
        .then(
            data=>{
                if(data.message === "success"){
                    navigate("/home")
                }
                else {
                    alert('Greska!\nPokusaj ponovo!');
                }
            }
        )
    }
    const handleChange = (e) =>{
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]:value,
        }));
    };
    const register = () => {
        navigate('/register')
    }
    return(<div className='container bg-dark border-top-5' style={{padding:'10px', borderRadius:'8px', width:'400px'}}>
        <h3 className='text' style={{textAlign:'center', color:'yellowgreen'}}>Log In to Your account!</h3>
        <form onSubmit={handleSubmit}>
            <label htmlFor='username' className='form-label text-secondary'>Input Your Username</label>
            <input type='text' className='form-control' id='username' name='username' value={formData.username} onChange={handleChange} required></input>
            
            <label htmlFor='password' className='form-label text-secondary'>Input Your Password</label>
            <input type='password' className='form-control' id='password' name='password' value={formData.password} onChange={handleChange} required></input>
            
            <button type='submit' className='btn btn-primary' style={{marginTop:'5px'}}>LogIn</button>
            
        </form>
        <button onClick={register} className='btn' style={{backgroundColor:'yellowgreen', marginTop:'5px'}}>Register</button>
    </div>)
}



export default LogIn;
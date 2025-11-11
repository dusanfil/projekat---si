import React, { useEffect } from 'react'
import {Link} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import { useState } from 'react'

const NavBar = () =>{
    const [logged, setLogged] = useState(false);
    const navigate = useNavigate();
//     useEffect(() => {
//         (async () => {
//         await checkLogin();
//         })();
// }, []);
    checkLogin();
    return(

    <nav style={{borderBottom:'1px solid lightblue', marginBottom:'3px'}} className='nav justify-content-center'>
        <Link to='/home' className='nav-link'>Home</Link>
        {!logged?(<Link to='/login' className='nav-link'>LogIn</Link>):(<Link to='' className='nav-link' onClick={logOut}>Logout</Link>)}
        
        
    </nav>
    )
    
    function logOut(){
        fetch('http://localhost:5246/api/User/logout',{method:'GET', credentials:'include'})
        .then(async res=>{
            const data = await res.json();
            console.log(data);
            setLogged(false);
            navigate('/login');
        })
    }
    async function checkLogin(){
        let res = false;
        await fetch("http://localhost:5246/api/User/getLoginDetails/", {method:'GET',credentials:"include"})
        .then( (res) => {
            if(res.ok){
                setLogged(true)
                console.log('lala')
            } else if(res.status == 401){
                setLogged(false);
            }}
        )
    }
}

export default NavBar;
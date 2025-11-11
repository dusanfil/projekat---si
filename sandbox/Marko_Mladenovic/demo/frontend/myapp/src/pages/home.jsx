import 'bootstrap/dist/css/bootstrap.min.css'

import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

function Home(){
    
    const [user, setUser] = useState(null);
    
    const [books, setBooks] = useState(null);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
            naslov:'',
            autor:'',
        });

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]:value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5246/api/Book/addBook", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: formData.naslov,
                author: formData.autor
            }),
            credentials: 'include'
        })
        .then(res => {
            if(res.ok){
                alert('Knjiga uspesno dodata');
                fetch("http://localhost:5246/api/Book/getAll")
                .then(async res => {
                    if(res.ok){
                        const data = await res.json();
                        console.log(data);
                        setBooks(data);
                    }
                })
            }
            else alert("Knjiga nije dodata");
        })
        }

    useEffect(() => {
        fetch("http://localhost:5246/api/User/getLoginDetails/", {method:'GET',credentials:"include"})
        .then(async (res) => {
            if(res.ok){
                console.log(res);
                const data = await res.json();
                console.log(data);
                setUser(data);
            } else if(res.status == 401){
                console.log('laalal');
            }}
        )
        fetch("http://localhost:5246/api/Book/getAll")
        .then(async res => {
            if(res.ok){
                const data = await res.json();
                console.log(data);
                setBooks(data);
            }
        })
    },[])

    const showBooks = () =>{
        return books.map((book)=>{
            return (
            <div style={{border:'1px solid green',margin:'5px'}} className='container'>
                <h4><span style={{width:'250px',display:'inline-block'}}>{book.title}, <i>od {book.author}</i></span> <button onClick={() => deleteBook(book.id)}>Obrisi Knjigu</button></h4>
            </div>
            )
        })
    }

    function deleteBook(id){
        fetch('http://localhost:5246/api/Book/deleteBook/' + id,{
            method:'DELETE',
            credentials:'include'
        })
        .then(res => {
            if(res.ok){
                alert("Knjiga je uspesno obrisana!");
                fetch("http://localhost:5246/api/Book/getAll")
                .then(async res => {
                    if(res.ok){
                        const data = await res.json();
                        console.log(data);
                        setBooks(data);
                }
        })
            }
            else{
                alert("Knjiga nije uspesno obrisana");
            }
        })
        
    }

    return user?
    <>
        <h1>Ulogovani kao: <span style={{color:'blue'}}>{user.username}</span></h1><br></br>
        <div className='container bg-dark border-top-5' style={{padding:'10px', borderRadius:'8px', width:'250px'}}>
        <h3 className='text' style={{textAlign:'center', color:'yellowgreen'}}>Dodaj Knjigu</h3>
        <form onSubmit={handleSubmit}>
            <label htmlFor='naslov' className='form-label text-secondary'>Naslov knjige</label>
            <input type='text' className='form-control' id='naslov' name='naslov' value={formData.naslov} onChange={handleChange} required></input>
            
            <label htmlFor='autor' className='form-label text-secondary'>Autor Knjige</label>
            <input type='text' className='form-control' id='autor' name='autor' value={formData.autor} onChange={handleChange} required></input>
            
            <button type='submit' className='btn btn-primary' style={{marginTop:'5px'}}>Dodaj knjigu</button>
            
        </form>
        </div>
        <div className='container' style={{border:'1px solid black'}}>
            {books?
            (<div>{showBooks()}</div>):(<div>Ucitavaju se knjige...</div>)}
        </div>
        
    
    </>
    :
    <h1>Morate biti ulogovani</h1>

}

export default Home;
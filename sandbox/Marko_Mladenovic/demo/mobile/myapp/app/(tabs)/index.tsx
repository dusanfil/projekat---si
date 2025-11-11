import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';


import {View, Text} from 'react-native'
import { useEffect, useState } from 'react';
import { Button, HeaderShownContext } from '@react-navigation/elements';


export default function HomeScreen() {

  type Book = {
    id: string;
    title: string;
    author: string;
  };

  const [books, setBooks] = useState<Book[]>([]);

  
  useEffect(()=>{
    fetch("http://192.168.0.15:5246/api/Book/getAll")
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
            <View key={book.id} style={styles.containerBook}>
                <Text style={styles.text} key={'t'+book.id}>{book.title}, od: {book.author}</Text><Button onPressIn={() => deleteBook(book.id)} style={styles.button}>Obrisi</Button>
            </View>
            )
        })
    }
  function deleteBook(id:string){
    fetch('http://192.168.0.15:5246/api/Book/deleteBook/' + id,{
            method:'DELETE',
            credentials:'include'
        })
        .then(res => {
            if(res.ok){
                alert("Knjiga je uspesno obrisana!");
                fetch("http://192.168.0.15:5246/api/Book/getAll")
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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prikaz Knjiga</Text>
      {!books?
      (<Text>"Loading..."</Text>)
      :
      (showBooks())}
    </View>
  );
}



const styles = StyleSheet.create({
  title:{
    justifyContent:'center',
    fontSize:70,
  },
  containerBook:{
    padding:10,
    width:350,
    borderStyle:'solid',
    borderWidth:1,
    borderColor:'blue',
    margin:10,
    flexDirection:'row',
    alignItems:'center',
    borderRadius:15,
  },
  button:{
    width:125,
  },
  container:{
    marginTop:150,
    alignContent:'center',
    justifyContent:'center',
  },
  text:{
    flexDirection:'row',
    width:200,
    fontSize:15,
  }
});

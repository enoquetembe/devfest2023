/* eslint-disable react/jsx-key */
"use client"
import { FormEvent, useState, useEffect } from "react";
import { Item } from "./components/Item";
import { database } from "./services/firebase";
import {addDoc, collection, deleteDoc, getDocs, doc} from "firebase/firestore";

interface UserData {
  name: string;
  email: string;
}

export default function Home() {

  const [users, setUsers ] = useState<UserData[]>([])

  const [newUSer, setNewUser] = useState({
    name:'',
    email: ''
  })


  async function handleCreateNewUser(event: FormEvent) {
    event.preventDefault()

    await addDoc(collection(database, 'users'), {
      name: newUSer.name.trim(),
      email: newUSer.email.trim(),
    })

    setNewUser({name: "", email: ""})
  }

  async function handleDeleteUSer(id: string) {
    await deleteDoc(doc(database, "users", id));
  }

  useEffect(() => {
    async function fetchUsers() {
      const querySnapshot = await getDocs(collection(database, "users"));
      const fetchedUsers: UserData[] = [];
      
      querySnapshot.forEach((doc) => {
        fetchedUsers.push({...doc.data(), id: doc.id});
      });

      setUsers(fetchedUsers)
    }

    fetchUsers()
  }, [users])

  return (
    <main className='flex justify-center items-center h-screen bg-zinc-900'>
     <form onSubmit={handleCreateNewUser} className='flex flex-col gap-4 mr-40 bg-zinc-700 p-10 rounded-md'>
        <input 
         className="text-white w-full px-3 py-2 rounded-sm bg-zinc-900"
         type="text" 
         placeholder='Nome'
         value={newUSer.name}
         onChange={e => setNewUser({...newUSer, name: e.target.value})}
         />
        <input 
          className="text-white w-full px-3 py-2 rounded-sm bg-zinc-900"
          type="email" 
          placeholder='Email'
          value={newUSer.email}
          onChange={e => setNewUser({...newUSer, email: e.target.value})}
        />

        <button 
          className="bg-green-500 text-white w-full px-3 py-2 rounded-sm hover:bg-green-400"
          type="submit"
        >
          Save
        </button>
     </form>

     <div className="text-white">
      {
       users.map((user, id) => {
        return(
          <Item name={user.name} email={user.email} key={user.email} onDelete={() => handleDeleteUSer(user.id)}/>
        )
       })
      }
     
     </div>
    </main>
  )
}

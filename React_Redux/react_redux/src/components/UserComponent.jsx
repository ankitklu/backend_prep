import React, { useEffect, useState } from 'react'

function UserComponent() {
  const [user, setUser]= useState(null);
  const [loading, setLoading]= useState(false);
  const [error, setError]= useState(null);


  useEffect(()=>{
    async function getUser(){
      try{
          // setLoading(true);
          const userResp= await fetch('https://jsonplaceholder.typicode.com/users/1');
          const userData= await userResp.json();
          setUser(userData);
      }
      catch(err){
        setError(err);
      }
      finally{
        setLoading(false);
      }

    }
    getUser();
  },[]);

  if(loading){
    return <h1>Loading....</h1>
  }
  if(error){
    return <h1>Error....</h1>
  }

  return (
    <>
      <div>UserComponent: </div>
      {user && <div>Name: {user.name}</div>}
    </>
  )
}

export default UserComponent
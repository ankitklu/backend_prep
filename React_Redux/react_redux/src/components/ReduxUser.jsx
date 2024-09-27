import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import fetchUserMiddleWare from '../redux/middleWare/fetchUserMiddleWare';

function ReduxUser() {
  // Correct the key to 'userSection' as per your store setup
  const { user, loading, error } = useSelector(store => store.userSection || { user: null, loading: false, error: null });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserMiddleWare());
  }, [dispatch]);

  if (loading) {
    return <h1>Loading....</h1>;
  }
  if (error) {
    return <h1>Error: {error}</h1>;
  }

  return (
    <>
      <div>UserComponent:</div>
      {user && <div>Name: {user.name}</div>}
    </>
  );
}

export default ReduxUser;

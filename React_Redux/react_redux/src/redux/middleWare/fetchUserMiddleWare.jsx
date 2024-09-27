import { userActions } from "../slice/UserSlice";

const fetchUserMiddleWare = () => {
  return async (dispatch) => {
    try {
      dispatch(userActions.onPending());
      const userResp = await fetch('https://jsonplaceholder.typicode.com/users/1');
      const userData = await userResp.json();
      dispatch(userActions.onFulfilled(userData));
    } catch (err) {
      dispatch(userActions.onRejected(err.message)); // Ensure error is properly handled
    }
  };
};

export default fetchUserMiddleWare;

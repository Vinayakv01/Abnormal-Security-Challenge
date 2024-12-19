const initialState = {
    user: null, // Default value for the user
  };
  
  export const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_USER':
        return {
          ...state,
          user: action.payload,
        };
      default:
        return state;
    }
  };
  
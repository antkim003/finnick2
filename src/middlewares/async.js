export default function({ dispatch }) {
  return next => action => {
    // if action does not have a payload
    // or, the payload does not have a .then property
    // we dont care about it, send it on
    if (!action.payload || !action.payload.then) {
      return next(action);
    }

    // make sure action's promise resolves
    action.payload
      .then(function(response) {
        const newAction = {...action, payload: response };
        dispatch(newAction);
      });
  }
}

exports.userDTO = (user) => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    dob: user.dob
  };
};
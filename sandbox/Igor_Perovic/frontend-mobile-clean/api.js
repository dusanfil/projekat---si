import axios from "axios";

const API = "http://192.168.1.53:5131/api/users";

export const getUsers = () => axios.get(API);
export const addUser = (user) => axios.post(API, user);
export const deleteUser = (id) => axios.delete(`${API}/${id}`);

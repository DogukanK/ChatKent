import axios from 'axios';

const API_ROOT = process.env.REACT_APP_SERVER_URI

axios.defaults.baseURL = API_ROOT;
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';


export const fetchUsers = () => {
    console.log("fetching users")
    return axios.get(`/users`)
    .then(res => res.data.data)


}
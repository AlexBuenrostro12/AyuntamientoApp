import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://ayuntamiento-77d3b.firebaseio.com/'
});

export default instance;
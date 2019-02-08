import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://us-central1-ayuntamiento-77d3b.cloudfunctions.net/uploadFile'
});

export default instance;
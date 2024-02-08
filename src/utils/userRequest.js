
import axios from "axios";
import { baseUrl } from './config.js';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI1LCJlbWFpbCI6ImFiZHVsbWFqaWQxbTJAZ21haWwuY29tIiwiaWF0IjoxNzAyNDUwNTEwLCJleHAiOjE3MDI1MzY5MTB9.GqAlxHyjX_NG7XmmXf8jSUYaDdHw3yha9UmlVQZbXus'
const newRequest = axios.create({
    baseURL: baseUrl,
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export default newRequest;
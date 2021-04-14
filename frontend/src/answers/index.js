import React,{ useState, useEffect, Fragment } from 'react'
import axios from 'axios';

export const Answers = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        const result = await axios(
            '/api/questions',
        );
        setData(result.data);
        };
        fetchData();
    }, []);

    return (
    <Fragment>
        <ul>
          {
            data.map(item => (<li key={item.questionID}>{item.answer}</li>))
          }
        </ul>
    </Fragment>
    )
}

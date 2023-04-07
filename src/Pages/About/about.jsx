import React, {useState, useEffect} from "react";
import axios from "axios";

export default function About() {
  const [data,setData]= useState([]);

  useEffect(() => {
    async function fetchData(){
      const result = await axios.get("http://localhost:8081/test");
      setData(result.data);
    }
    fetchData();
  },[]);

  return (
      <div>
        <h1>About </h1>
        {data.map((test)=> (
          <li key={test.id}> test </li>
        ))}
      </div>
  );
}
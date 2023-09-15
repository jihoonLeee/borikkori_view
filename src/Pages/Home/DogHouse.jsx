import React, {useState, useEffect} from "react";
import axios from "axios";
import Header from "../Layout/header";
import Footer from "../Layout/footer";

export default function DogHouse() {
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
        <Header />
        <h1>메인 </h1>
        {data.map((test)=> (
          <li key={test.id}> test </li>
        ))}
        <Footer />
      </div>
  );
}
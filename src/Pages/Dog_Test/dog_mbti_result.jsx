import React from "react";
import axios from "axios";
import Header from "../Layout/header";
import Footer from "../Layout/footer";
import Result from "../../Components/Result";

export default function DBTI_Result(props) {
  return (
      <div>
        <Header />
          <Result result_data={props} />
        <Footer />
      </div>
  );
}
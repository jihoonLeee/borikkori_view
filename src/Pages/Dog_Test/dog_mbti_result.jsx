import React from "react";
import axios from "axios";
import Result from "../../Components/Result";

export default function DBTI_Result(props) {
  return (
      <div>
        <Result result_data={props} />
      </div>
  );
}
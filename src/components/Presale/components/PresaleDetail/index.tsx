import React from 'react'
import { useParams } from "react-router-dom";


function PresaleDetail() {

  let params = useParams();
  console.log(params);

    return (
        <div>
            Welcome to Presale {params.presaleID}
        </div>
    )
}

export default PresaleDetail


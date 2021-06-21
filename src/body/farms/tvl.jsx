
import {Fragment, useState, useEffect} from 'react'


export default function Tvl() {
  var [value, setValue] = useState(0)

  return(
    <Fragment><div className="txt tvl ml-auto">TVL ${(value).toFixed(0)}</div></Fragment>
  
    )
}
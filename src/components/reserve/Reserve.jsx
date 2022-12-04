import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
import "./reserve.css";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const {dates} = useContext(SearchContext);
  const { data, loading, error } = useFetch(
    `http://localhost:8000/api/hotels/room/${hotelId}`
  );

  // Get dates in selected range
  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const date = new Date(start.getTime());
    let dates = [];
    while(date <= end){
        dates.push(new Date(date))
        date.setDate(date.getDate()+1)
    }

    return dates;
  };

  console.log(getDatesInRange(dates[0].startDate, dates[0].endDate))

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const handleClick =()=> {

  }

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {data.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">{item.price}</div>
            </div>
            {item.roomNumbers.map((roomNumber) => (
              <div className="room" key={roomNumber._id}>
                <label>{roomNumber.number}</label>
                <input
                  type="checkbox"
                  value={roomNumber._id}
                  onChange={handleSelect}
                />
              </div>
            ))}
          </div>
        ))}
        <button onClick={handleClick} className="rButton">Reserve Now!</button>
      </div>
    </div>
  );
};

export default Reserve;

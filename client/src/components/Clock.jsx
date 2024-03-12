import React, { useState, useEffect } from 'react'

const Clock = () => {

    let time = new Date().toLocaleTimeString()

    const [currentTime, setCurrentTime] = useState(time)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

  return (
    <div>
        <p className='text-3xl font-bold'>{currentTime}</p>
    </div>
  )
}

export default Clock
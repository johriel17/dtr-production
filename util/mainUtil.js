export const convertTimeFormat = (timeString) => {
    const time = new Date('2000-01-01 ' + timeString);
  
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
  
    return `${hours}:${minutes}`;
  };
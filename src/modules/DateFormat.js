function DateFormat(dateString) {
    const inputDate = new Date(dateString);
  
    let formattedDate = `${inputDate.getFullYear()}.${inputDate.getMonth()+1}.${inputDate.getDate()} ${inputDate.getUTCHours()+9}:${inputDate.getUTCMinutes()}:${inputDate.getUTCSeconds()}`;
  
    return formattedDate;
  }
  
  module.exports = DateFormat;